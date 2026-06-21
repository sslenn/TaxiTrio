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

const register = async ({ full_name, email, phone, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const exists = await User.findOne({ where: { email: normalizedEmail } });
  if (exists) throw { status: 409, message: 'Email already registered' };

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ full_name, email: normalizedEmail, phone, password: hash, role: 'traveler' });
  return { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ where: { email: normalizedEmail } });
  if (!user) {
    throw { status: 401, message: 'Wrong email' };
  }
  if (!(await bcrypt.compare(password, user.password))) {
    throw { status: 401, message: 'Wrong password' };
  }
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

const crypto = require('crypto');
const { sendEmail } = require('../utils/mailer');

const forgotPassword = async (email) => {
  if (!email) throw { status: 400, message: 'Email address is required' };
  
  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    throw { status: 404, message: 'No account registered with this email address' };
  }

  // Generate secure token (hex) and expiration (1 hour)
  const token = crypto.randomBytes(20).toString('hex');
  
  await user.update({
    reset_password_token: token,
    reset_password_expires: new Date(Date.now() + 3600000) // 1 hour from now
  });

  const appUrl = process.env.APP_URL || 'http://localhost:5000';
  // Link points to the frontend app reset route
  const frontendUrl = appUrl.includes('5000') ? 'http://localhost:5173' : appUrl;
  const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

  const emailSubject = 'TaxiTrio - Reset Your Password';
  const emailText = `Hello ${user.full_name},\n\nYou requested to reset your password. Click the link below to set a new password:\n\n${resetLink}\n\nThis link is valid for 1 hour.\n\nBest regards,\nThe TaxiTrio Team`;
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #0b0b0b; color: #fff;">
      <h2 style="color: #D4AF37; text-align: center; font-family: Georgia, serif;">TaxiTrio</h2>
      <p style="color: #fff;">Hello <strong>${user.full_name}</strong>,</p>
      <p style="color: #A3A3A3;">We received a request to reset the password for your TaxiTrio account. Click the button below to secure your account and set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" target="_blank" style="background-color: #D4AF37; color: #000; padding: 12px 25px; border-radius: 50px; font-weight: bold; text-decoration: none; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #A3A3A3;">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
      <hr style="border: 0; border-top: 1px solid #2A2A2A; margin: 20px 0;" />
      <p style="font-size: 11px; color: #555; text-align: center;">This link is valid for 1 hour.<br/>&copy; 2026 TaxiTrio. All rights reserved.</p>
    </div>
  `;

  await sendEmail({
    to: user.email,
    subject: emailSubject,
    text: emailText,
    html: emailHtml
  });

  return { email: user.email };
};

const resetPassword = async ({ email, token, new_password }) => {
  if (!email || !token || !new_password) {
    throw { status: 400, message: 'Email, token, and new password are required' };
  }

  const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    throw { status: 404, message: 'User not found' };
  }

  // Validate token and expiration
  if (user.reset_password_token !== token) {
    throw { status: 400, message: 'Invalid reset password token' };
  }

  const expiresTime = new Date(user.reset_password_expires).getTime();
  if (expiresTime < Date.now()) {
    throw { status: 400, message: 'Reset password token has expired' };
  }

  // Hash and save new password
  const hash = await bcrypt.hash(new_password, 10);
  
  await user.update({
    password: hash,
    is_active: true,
    reset_password_token: null,
    reset_password_expires: null
  });

  return { email: user.email };
};

const googleLogin = async (googleUser) => {
  if (!googleUser.email) {
    throw { status: 400, message: 'Google account does not provide an email address' };
  }

  let user = await User.findOne({ where: { email: googleUser.email.toLowerCase().trim() } });
  
  if (!user) {
    // Generate a secure random password for Google-created accounts
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const hash = await bcrypt.hash(randomPassword, 10);
    
    user = await User.create({
      full_name: googleUser.name || 'Google User',
      email: googleUser.email.toLowerCase().trim(),
      password: hash,
      role: 'traveler', // default role for Google signup
      is_active: true
    });
  }

  if (!user.is_active) {
    throw { status: 403, message: 'Account deactivated' };
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const { password: _, ...userData } = user.toJSON();
  return { accessToken, refreshToken, user: userData };
};

const changePassword = async (userId, { current_password, new_password }) => {
  if (!current_password || !new_password) {
    throw { status: 400, message: 'Current password and new password are required' };
  }

  const user = await User.findByPk(userId);
  if (!user) throw { status: 404, message: 'User not found' };

  const isMatch = await bcrypt.compare(current_password, user.password);
  if (!isMatch) throw { status: 401, message: 'Incorrect current password' };

  if (new_password.length < 6) {
    throw { status: 400, message: 'Password must be at least 6 characters' };
  }

  const hash = await bcrypt.hash(new_password, 10);
  await user.update({
    password: hash,
    must_change_password: false
  });

  return { id: user.id, email: user.email, must_change_password: user.must_change_password };
};

const activateDriver = async ({ token, password }) => {
  if (!token || !password) {
    throw { status: 400, message: 'Activation token and password are required' };
  }

  const user = await User.findOne({ where: { activation_token: token } });
  if (!user) {
    throw { status: 400, message: 'Invalid or expired activation link' };
  }

  const expiresTime = new Date(user.token_expires_at).getTime();
  if (expiresTime < Date.now()) {
    throw { status: 400, message: 'Activation link has expired' };
  }

  if (password.length < 6) {
    throw { status: 400, message: 'Password must be at least 6 characters' };
  }

  const hash = await bcrypt.hash(password, 10);
  await user.update({
    password: hash,
    is_active: true,
    status: 'active',
    activation_token: null,
    token_expires_at: null
  });

  return { id: user.id, email: user.email, status: user.status };
};

module.exports = { register, login, refresh, getMe, forgotPassword, resetPassword, googleLogin, changePassword, activateDriver };
