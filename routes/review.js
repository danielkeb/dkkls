const express = require('express');
const { Review } = require('../models/review');

const router = express.Router();

// Create a new review
router.post('/', async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a review by ID
router.put('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    await review.update(req.body);
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a review by ID
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    await review.destroy();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
