const express = require('express');
const db = require('../models');
const router = express.Router();
// Create a new wishList
router.post('/', async (req, res) => {
  try {
    const wishList = await db.WishList.create(req.body);
    res.status(201).json(wishList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all wishList
router.get('/', async (req, res) => {
  try {
    const wishList = await db.WishList.findAll();
    res.json(wishList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific wishList by ID
router.get('/:id', async (req, res) => {
  try {
    const wishList = await db.WishList.findByPk(req.params.id);
    if (!wishList) return res.status(404).json({ error: 'wishList not found' });
    res.json(wishList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a wishList by ID
router.put('/:id', async (req, res) => {
  try {
    const wishList = await db.WishList.findByPk(req.params.id);
    if (!wishList) return res.status(404).json({ error: 'wishList not found' });

    await cateWishList.update(req.body);
    res.json(wishList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a wishList by ID
router.delete('/:id', async (req, res) => {
  try {
    const wishList = await db.WishList.findByPk(req.params.id);
    if (!wishList) return res.status(404).json({ error: 'wishList not found' });

    await cateWishList.destroy();
    res.json({ message: 'wishList deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
