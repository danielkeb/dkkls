const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();
// Create a new category
router.post('/', async (req, res) => {
  try {
    const category = await prisma.Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all categorys
router.get('/', async (req, res) => {
  try {
    const categorys = await prisma.Category.findAll();
    res.json(categorys);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await prisma.Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'category not found' });
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a category by ID
router.put('/:id', async (req, res) => {
  try {
    const category = await prisma.Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'category not found' });

    await cateCategory.update(req.body);
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a category by ID
router.delete('/:id', async (req, res) => {
  try {
    const category = await prisma.Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'category not found' });

    await cateCategory.destroy();
    res.json({ message: 'category deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
