const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'lessons');

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
  const allowedTypes = /mp4|mkv|avi/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'));
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

// Create a new lesson
router.post('/add', upload.single('videoUrl'), async (req, res) => {
  try {
    const { title, content, duration, courseId } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        duration: parseInt(duration, 10), // Ensure duration is an integer
        courseId,
        videoUrl: req.file.filename, // Store only the filename
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany();
    res.json(lessons);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get video file by filename
router.get('/video/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), 'lessons', filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
});

// Get a specific lesson by ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
    });
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a lesson by ID
router.put('/:id', upload.single('videoUrl'), async (req, res) => {
  try {
    const { title, content, duration, courseId } = req.body;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
    });
    if (!existingLesson) return res.status(404).json({ error: 'Lesson not found' });

    const updateData = {
      title,
      content,
      duration: parseInt(duration, 10),
      courseId,
    };

    if (req.file) {
      updateData.videoUrl = req.file.filename;
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id: req.params.id },
      data: updateData,
    });

    res.json(updatedLesson);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a lesson by ID
router.delete('/:id', async (req, res) => {
  try {
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: req.params.id },
    });
    if (!existingLesson) return res.status(404).json({ error: 'Lesson not found' });

    // Optionally delete the video file from the file system
    const filePath = path.join(process.cwd(), 'lessons', existingLesson.videoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.lesson.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
