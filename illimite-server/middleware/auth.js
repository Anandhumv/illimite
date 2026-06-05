const { admin } = require('../config/firebase');

async function verifyFirebaseToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Missing Firebase ID token'
    });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    return next();
  } catch (error) {
    console.error('[Auth] Token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired Firebase ID token'
    });
  }
}

module.exports = { verifyFirebaseToken };
