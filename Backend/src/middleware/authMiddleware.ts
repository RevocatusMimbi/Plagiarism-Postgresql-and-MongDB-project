import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes
export const protect = (req, res, next) => {
  // 1. Get the token from the HTTP-only cookie
  const token = req.cookies.access_token;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized, no token provided.' });
  }

  try {
    // 2. Verify the token using the secret key
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Attach the decoded user payload to the request object
    req.user = decoded;

    // 4. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res
      .status(401)
      .json({ message: 'Not authorized, token failed or expired.' });
  }
};

// Middleware for role-based access control (RBAC)
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // req.user is populated by the protect middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role (${req.user?.role}) is not authorized to access this resource.`,
      });
    }
    next();
  };
};
