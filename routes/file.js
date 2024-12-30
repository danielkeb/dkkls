const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

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
  const allowedTypes =/jpeg|jpg|png|gif|mp4|mkv|avi|pdf|doc|docx|ppt|pptx/;
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

// Multiple files upload route
router.post('/upload/multiple', upload.array('files', 10), (req, res) => {
  try {
    res.status(200).json({
      message: 'Files uploaded successfully',
      files: req.files,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Files upload failed',
      error: err.message,
    });
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
