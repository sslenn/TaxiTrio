const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'access_secret',
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '20m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET || 'refresh_secret',
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

const register = async ({ full_name, email, phone, password, role = 'traveler' }) => {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw { status: 409, message: 'Email already registered' };

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ full_name, email, phone, password: hash, role });
  return { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password)))
    throw { status: 401, message: 'Invalid credentials' };
  if (!user.is_active) throw { status: 403, message: 'Account deactivated' };

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password: _, ...userData } = user.toJSON();
  return { accessToken, refreshToken, token: accessToken, user: userData };
};

const refresh = async (tokenValue) => {
  if (!tokenValue) throw { status: 400, message: 'Refresh token is required' };

  try {
    const decoded = jwt.verify(tokenValue, process.env.JWT_REFRESH_SECRET || 'refresh_secret');
    const user = await User.findByPk(decoded.id);
    if (!user) throw { status: 404, message: 'User not found' };
    if (!user.is_active) throw { status: 403, message: 'Account deactivated' };

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, token: newAccessToken };
  } catch (err) {
    if (err.status) throw err;
    throw { status: 401, message: 'Invalid or expired refresh token' };
  }
};

const getMe = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
  });
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
};

module.exports = { register, login, refresh, getMe };
