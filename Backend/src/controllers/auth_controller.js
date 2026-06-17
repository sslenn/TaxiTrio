const authService = require('../services/auth_service');
const { successResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(successResponse('Registration successful', user));
  } catch (e) { next(e); }
};

const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });

    // Remove refreshToken from response body for security
    delete data.refreshToken;

    res.json(successResponse('Login successful', data));
  } catch (e) { next(e); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(successResponse('User profile', user));
  } catch (e) { next(e); }
};

const refresh = async (req, res, next) => {
  try {
    // Read refresh token from cookies
    const refreshToken = req.cookies.refreshToken;
    const data = await authService.refresh(refreshToken);

    // Rotate refresh token: set new one in HTTP-only cookie
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    delete data.refreshToken;

    res.json(successResponse('Token refreshed successfully', data));
  } catch (e) { next(e); }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.json(successResponse('Logout successful'));
  } catch (e) { next(e); }
};

module.exports = { register, login, refresh, logout, getMe };
