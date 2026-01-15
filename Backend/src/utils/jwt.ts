/**
 * Send token response with cookie
 * @param {Object} res - Express response object
 * @param {string} token - JWT token
 * @param {Object} user - User object
 * @param {string} role - User role
 * @param {string} message - Response message
 */
export const sendTokenResponse = (res, token, user, role, message) => {
  // Set cookie options
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevent client-side access
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  };

  // Remove password from user object
  const { password, ...userData } = user;

  // Set token as cookie
  res.cookie('token', token, options);

  // Send response
  res.status(200).json({
    success: true,
    message,
    data: {
      user: userData,
      role,
    },
  });
};
