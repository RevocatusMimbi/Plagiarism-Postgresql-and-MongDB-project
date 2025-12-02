/**
 * Central error handling middleware for Express.
 * Catches errors passed via next(err) and formats a standardized response.
 */
const errorHandler = (err, req, res, next) => {
    // Check if a status code was already set, otherwise default to 500
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Handle Prisma unique constraint violation (P2002)
    if (err.code === 'P2002') {
        statusCode = 409;
        message = 'A resource with these details already exists (Unique constraint violation).';
    }
    
    // Handle JWT verification errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Not authorized, token failed or expired.';
    }

    // Set JSON response
    res.status(statusCode).json({
        message: message,
        // Only include stack trace in development mode for debugging
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default errorHandler;