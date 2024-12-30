const express = require('express');
const db = require('../models');
const router = express.Router();
// Create a new discussion
router.post('/', async (req, res) => {
  try {
    const discussion = await db.Discussion.create(req.body);
    res.status(201).json(discussion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all discussions
router.get('/', async (req, res) => {
  try {
    const discussions = await db.Discussion.findAll();
    res.json(discussions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific discussion by ID
router.get('/:id', async (req, res) => {
  try {
    const discussion = await db.Discussion.findByPk(req.params.id);
    if (!discussion) return res.status(404).json({ error: 'discussion not found' });
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a discussion by ID
router.put('/:id', async (req, res) => {
  try {
    const discussion = await db.Discussion.findByPk(req.params.id);
    if (!discussion) return res.status(404).json({ error: 'discussion not found' });

    await cateDiscussion.update(req.body);
    res.json(discussion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a discussion by ID
router.delete('/:id', async (req, res) => {
  try {
    const discussion = await db.Discussion.findByPk(req.params.id);
    if (!discussion) return res.status(404).json({ error: 'discussion not found' });

    await cateDiscussion.destroy();
    res.json({ message: 'discussion deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
