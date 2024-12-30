const express = require('express');
const {PrismaClient}=require('@prisma/client');
const prisma=new PrismaClient();
const router = express.Router();
// Create a new category
router.post('/', async (req, res) => {
  try {
    const payment = await prisma.payment.create(req.body);
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await prisma.payment.findAll();
    res.json(payments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific payment by ID
router.get('/:id', async (req, res) => {
  try {
    const payment = await prisma.payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a payment by ID
router.put('/:id', async (req, res) => {
  try {
    const payment = await prisma.payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ error: 'payment not found' });

    await catepayment.update(req.body);
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a payment by ID
router.delete('/:id', async (req, res) => {
  try {
    const payment = await prisma.payment.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: 'category not found' });

    await cateCategory.destroy();
    res.json({ message: 'category deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
