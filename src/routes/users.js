const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const { CustomError } = require('../utils/CustomError');

const router = express.Router();

router.get('/', auth, adminAuth, async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const users = await User.getAll(parseInt(limit), parseInt(page));
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id',
  auth,
  [
    body('email').optional().isEmail(),
    body('password').optional().isLength({ min: 6 })
  ],
  async (req, res, next) => {
    try {
      if (req.user.id !== req.params.id && !req.user.isAdmin) {
        throw new CustomError('Not authorized', 403);
      }

      const user = await User.update(req.params.id, req.body);
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', auth, adminAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    if (user.isAdmin) {
      throw new CustomError('Cannot delete admin user', 403);
    }

    await User.delete(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;