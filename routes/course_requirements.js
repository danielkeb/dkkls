const express = require('express');
const db = require('../models');
const router = express.Router();
// Create a new courseRequirement
router.post('/', async (req, res) => {
  try {
    const courseRequirement = await db.CourseRequirement.create(req.body);
    res.status(201).json(courseRequirement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courseRequirements
router.get('/', async (req, res) => {
  try {
    const courseRequirements = await db.CourseRequirement.findAll();
    res.json(courseRequirements);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific courseRequirement by ID
router.get('/:id', async (req, res) => {
  try {
    const courseRequirement = await db.CourseRequirement.findByPk(req.params.id);
    if (!courseRequirement) return res.status(404).json({ error: 'courseRequirement not found' });
    res.json(courseRequirement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a courseRequirement by ID
router.put('/:id', async (req, res) => {
  try {
    const courseRequirement = await db.CourseRequirement.findByPk(req.params.id);
    if (!courseRequirement) return res.status(404).json({ error: 'courseRequirement not found' });

    await cateCourseRequirement.update(req.body);
    res.json(courseRequirement);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a courseRequirement by ID
router.delete('/:id', async (req, res) => {
  try {
    const courseRequirement = await db.CourseRequirement.findByPk(req.params.id);
    if (!courseRequirement) return res.status(404).json({ error: 'courseRequirement not found' });

    await cateCourseRequirement.destroy();
    res.json({ message: 'courseRequirement deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
