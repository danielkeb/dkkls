const express = require('express');
const db = require('../models');
const router = express.Router();

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const notification = await db.Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await db.Notification.findAll();
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific notification by ID
router.get('/:id', async (req, res) => {
  try {
    const notification = await db.Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a notification by ID
router.put('/:id', async (req, res) => {
  try {
    const notification = await db.Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.update(req.body);
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark a notification as read
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await db.Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.update({ isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Mark a notification as unread
router.put('/:id/unread', async (req, res) => {
  try {
    const notification = await db.Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.update({ isRead: false });
    res.json({ message: 'Notification marked as unread' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a notification by ID
router.delete('/:id', async (req, res) => {
  try {
    const notification = await db.Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notification not found' });

    await notification.destroy();
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
