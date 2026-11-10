const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { success, error } = require('../utils/apiResponse');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return error(res, 'Email already registered', 400);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user._id);
    return success(res, { token, user }, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) return error(res, 'Invalid email or password', 401);

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return error(res, 'Invalid email or password', 401);

    const token = signToken(user._id);
    // Don't return passwordHash
    const userObj = user.toJSON();
    return success(res, { token, user: userObj }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res) => {
  return success(res, { user: req.user }, 'User fetched');
};

module.exports = { register, login, getMe };
