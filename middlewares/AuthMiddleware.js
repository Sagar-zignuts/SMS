const jwt = require('jsonwebtoken');
require('dotenv').config();

//Auth middleware for token and role check
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: 'Token is not availabel' });
  }

  try {
    const decoder = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoder;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ success: false, message: 'Invalid token', error });
  }
};

//only admin can use this
const restrictedToAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

module.exports = { authMiddleware, restrictedToAdmin };
