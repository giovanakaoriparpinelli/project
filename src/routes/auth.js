const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { CustomError } = require('../utils/CustomError');

const router = express.Router();

router.post('/register',
  [
    body('username').isLength({ min: 3 }),
    body('password').isLength({ min: 6 }),
    body('email').isEmail()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new CustomError('Validation error', 400);
      }

      const existingUser = await User.findByUsername(req.body.username);
      if (existingUser) {
        throw new CustomError('Username already exists', 400);
      }

      const user = await User.create(req.body);
      res.status(201).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post('/login',
  [
    body('username').exists(),
    body('password').exists()
  ],
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findByUsername(username);
      if (!user) {
        throw new CustomError('Invalid credentials', 401);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new CustomError('Invalid credentials', 401);
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;