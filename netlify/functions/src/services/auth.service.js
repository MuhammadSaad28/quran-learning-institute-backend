const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw { statusCode: 401, message: 'Invalid email or password' };
  }
  if (!user.isActive) {
    throw { statusCode: 401, message: 'Account is deactivated' };
  }
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    timezone: user.timezone,
    token: generateToken(user._id),
  };
};

const updateProfile = async (userId, data) => {
  const user = await User.findByIdAndUpdate(userId, data, { new: true }).select('-password');
  return user;
};

const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!(await user.comparePassword(currentPassword))) {
    throw { statusCode: 400, message: 'Current password is incorrect' };
  }
  user.password = newPassword;
  await user.save();
  return { message: 'Password updated successfully' };
};

module.exports = { generateToken, login, updateProfile, changePassword };
