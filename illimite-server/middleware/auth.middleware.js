const admin = require('firebase-admin');

/**
 * Express Middleware to verify Firebase ID Tokens
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if the Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token missing or malformed.'
    });
  }

  // 2. Extract the actual token from the header string
  const token = authHeader.split(' ')[1];

  try {
    // 3. Use Firebase Admin SDK to decode and verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 4. Attach the verified user details to the request object
    // This allows Anandhu and Balu's backend routes to easily read req.user.uid or req.user.email
    req.user = decodedToken;

    // 5. Let the request pass through to the actual route handler
    next();
  } catch (error) {
    console.error('Firebase token verification failed:', error.message);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired access token.'
    });
  }
};

module.exports = verifyToken;