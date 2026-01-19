const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (email, password) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('Email already in use');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    passwordHash,
  });

  return {
    id: user._id,
    email: user.email,
  };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  };
};
