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

const forgotPassword = async (req, res, next) => {
  try {
    const data = await authService.forgotPassword(req.body.email);
    res.json(successResponse('Password reset link sent successfully', data));
  } catch (e) { next(e); }
};

const resetPassword = async (req, res, next) => {
  try {
    const data = await authService.resetPassword(req.body);
    res.json(successResponse('Password reset successfully', data));
  } catch (e) { next(e); }
};

const initiateGoogleAuth = (req, res) => {
  const clientID = process.env.GOOGLE_CLIENT_ID;
  const redirectURI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';
  
  if (!clientID) {
    console.error("❌ Google Client ID is not configured in environment variables.");
    return res.status(500).send("Google OAuth2 is not configured on this server. Missing GOOGLE_CLIENT_ID.");
  }
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=${encodeURIComponent(redirectURI)}&response_type=code&scope=profile%20email`;
  res.redirect(googleAuthUrl);
};

const handleGoogleCallback = async (req, res, next) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  if (!code) {
    return res.redirect(`${frontendUrl}/login?error=no_authorization_code`);
  }
  
  try {
    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectURI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback';
    
    // 1. Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
        grant_type: 'authorization_code'
      })
    });
    
    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      throw new Error(`Failed to exchange code: ${errText}`);
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;
    
    // 2. Retrieve user information from Google API
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to retrieve user profile from Google');
    }
    
    const googleUser = await userResponse.json();
    
    // 3. Process database registration/login
    const data = await authService.googleLogin(googleUser);
    
    // 4. Set Rotate Refresh Token in Cookie
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    // 5. Redirect back to React frontend login route with credentials
    res.redirect(`${frontendUrl}/login?token=${data.accessToken}&user=${encodeURIComponent(JSON.stringify(data.user))}`);
  } catch (err) {
    console.error('Google OAuth Authentication Error:', err);
    res.redirect(`${frontendUrl}/login?error=${encodeURIComponent(err.message || 'google_auth_failed')}`);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const data = await authService.changePassword(req.user.id, req.body);
    res.json(successResponse('Password changed successfully', data));
  } catch (e) { next(e); }
};

const activateDriver = async (req, res, next) => {
  try {
    const data = await authService.activateDriver(req.body);
    res.json(successResponse('Driver account activated successfully', data));
  } catch (e) { next(e); }
};

module.exports = { 
  register, 
  login, 
  refresh, 
  logout, 
  getMe, 
  forgotPassword, 
  resetPassword,
  initiateGoogleAuth,
  handleGoogleCallback,
  changePassword,
  activateDriver
};
