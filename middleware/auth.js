const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY; // Ensure this is defined in your environment variables

// Middleware to authenticate user using HTTP-only cookies
function authenticateToken(req, res, next) {
  // Retrieve token from HTTP-only cookie
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden
    }
    req.user = user; // Attach user info to request object
    next();
  });
}

// Middleware to check user roles
function authorizeRole(requiredRole) {
  return (req, res, next) => {
    if (req.user?.role !== requiredRole) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
