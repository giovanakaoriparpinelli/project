const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    await User.init();
    
    const adminExists = await User.findByUsername(process.env.ADMIN_USERNAME);
    if (!adminExists) {
      await User.create({
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        email: 'admin@example.com',
        isAdmin: true
      });
    }

    res.json({
      success: true,
      message: 'System installed successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;