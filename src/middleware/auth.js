const jwt = require('jsonwebtoken');
const { CustomError } = require('../utils/CustomError');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new CustomError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new CustomError('Invalid token', 401));
  }
};

const adminAuth = (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new CustomError('Admin privileges required', 403);
    }
    next();
  } catch (error) {
    next(new CustomError('Admin privileges required', 403));
  }
};

module.exports = { auth, adminAuth };