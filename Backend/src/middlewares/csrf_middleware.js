// Double Submit Cookie Pattern

const { doubleCsrf } = require('csrf-csrf');
const jwt = require('jsonwebtoken');
const {
  doubleCsrfProtection,
  generateCsrfToken: generateToken,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'taxitrio_csrf_secret_fallback_key_2026',
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
  getTokenFromRequest: (req) => req.headers['x-csrf-token'] || req.body?.csrfToken,
  getSessionIdentifier: (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.id) {
          return decoded.id;
        }
      } catch (e) {
        // ignore
      }
    }
    return req.cookies?.refreshToken || 'anonymous';
  },
});

module.exports = { doubleCsrfProtection, generateToken };
