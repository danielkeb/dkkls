const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {PrismaClient}= require("@prisma/client");
const prisma= new PrismaClient();
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { ObjectId } = require('mongodb');


// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'thumbnail');

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
// POST route to add a new course with file upload
router.post('/add', async (req, res) => {
  const { title, description, price, thumbnail, userId } = req.body;

  try {
    const newCourse = await prisma.course.create({
      data:{
        title, 
        description,
        price,
        thumbnail, 
        userId
      }
    });
    res.status(201).json(newCourse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to fetch all courses
// GET route to fetch all courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.Course.findMany({
      include: {
        user: {select:{id:true, username:true,bio:true}, },        // Include related user data
        Lessons: true,      // Include related lessons data
        categories: true,   // If you also want to include related categories
        enrollments: true,  // If you want to include related enrollments
        reviews: true,      // If you want to include related reviews
        discussions: true, // If you want to include related discussions
        wishlist: true,     // If you want to include related wishlist
        Payment: true,      // If you want to include related payments
      },
    });
    res.json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to fetch a course by ID
router.get('/courseId/:id', async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate the courseId as ObjectId
    if (!ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        user: {select:{id:true, username:true, bio:true}, },        // Include related user data
        Lessons: true,      // Include related lessons data
        categories: true,   // If you also want to include related categories
        enrollments: true,  // If you want to include related enrollments
        reviews: true,      // If you want to include related reviews
        discussions: true, // If you want to include related discussions
        wishlist: true,     // If you want to include related wishlist
        Payment: true,      // If you want to include related payments
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:filename', (req, res) => {
  const { filename } = req.params;

  // Set the file path to the uploads directory in the root
  const filePath = path.join(process.cwd(), 'uploads', filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
      // Send the file to the client
      res.sendFile(filePath);
  } else {
      // If the file doesn't exist, return a 404 error
      res.status(404).json({
          message: 'File not found',
      });
  }
});

module.exports = router;

