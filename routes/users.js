const multer = require('multer');
const path = require('path');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const { authenticateToken, authorizeRole } = require('../middleware/auth');



// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');

    // Ensure the upload path exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique name for the file
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Set up file filtering for multer
const fileFilter = (req, file, cb) => {
  const allowedTypes =/jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

// Initialize multer with storage and file filter options
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50, // 50 MB limit for file size
  },
});

// Single file upload route
router.post('/upload/single', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (err) {
    res.status(500).json({
      message: 'File upload failed',
      error: err.message,
    });
  }
});
// // Create a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password} = req.body;

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Create the user
    const user = await prisma.user.create({ 
      data:{
        username,
         email,
          password: hashedPassword, 
      }
     
     });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const secretKey = process.env.JWT_SECRET_KEY;
  
  if (!secretKey) {
    return res.status(500).json({ error: 'JWT secret key is not defined' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify the password
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Create a JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role ,username:user.username},
      secretKey,
      { expiresIn: '1h' }
    );

    // Set the JWT as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Ensures the cookie cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Ensures the cookie is only sent over HTTPS in production
      sameSite: 'Strict', // Helps prevent CSRF attacks
      maxAge: 3600000, // 1 hour in milliseconds
    });

    // Respond with success message or user data
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Protected route to verify the token
router.get('/token', authenticateToken,(req, res) => {
  // If the middleware passes, the user is authenticated
  res.status(200).json({ authenticated: true, user: req.user });
});

router.post('/logout', authenticateToken, (req, res) => {

  res.clearCookie('token');

  res.status(200).json({ message: 'Logged out successfully' });
});



// Get all users (admin only)
router.get('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const users = await prisma.User.findMany();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific user by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id; // No need to parse the id as an integer
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/profile/:id', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { username, bio } = req.body; // Access properties directly from req.body

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        bio,
        avatar: req.file ? req.file.filename : user.avatar, // Store only the file name
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ error: error.message });
  }
});


// Update user by ID
router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { username, email, bio, avatar } = req.body;
    const user = await prisma.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.update({ username, email, bio, avatar });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete user by ID
router.delete('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const user = await prisma.User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
