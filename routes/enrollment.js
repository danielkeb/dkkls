const express = require('express');
const {PrismaClient}=require('@prisma/client');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const prisma=new PrismaClient();

const router = express.Router();

// Create a new enrollment
router.post('/', authenticateToken, authorizeRole('student'), async (req, res) => {
  try {
    const enrollment = await prisma.enrollment.create(req.body);
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all enrollments
router.get('/', async (req, res) => {
  try {
    const enrollments = await prisma.Enrollment.findAll();
    res.json(enrollments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific enrollment by ID
router.get('/:id', async (req, res) => {
  try {
    const enrollment = await prisma.Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an enrollment by ID
router.put('/:id', async (req, res) => {
  try {
    const enrollment = await prisma.Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    await prisma.enrollment.update(req.body);
    res.json(enrollment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an enrollment by ID
router.delete('/:id', async (req, res) => {
  try {
    const enrollment = await prisma.Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    await prisma.enrollment.destroy();
    res.json({ message: 'Enrollment deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
