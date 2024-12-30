const express=require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/token', authenticateToken, (req, res) => {
    // If the middleware passes, the user is authenticated
    res.status(200).json({ authenticated: true, user: req.user });
  });

  module.exports = router;