import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
// Default to 1 day if not specified in .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'; 

// --- 1. Function to sign a new JWT token ---
export const generateToken = (payload) => {
    if (!JWT_SECRET) {
        // Throwing an error here ensures the app crashes early if the secret is missing
        throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};

// --- 2. Function to set the token as a secure HTTP-only cookie ---
export const sendTokenResponse = (res, token, user, role, message) => {
    
    // Use the same expiry for the cookie as the token
    const maxAge = parseInt(JWT_EXPIRES_IN) * 24 * 60 * 60 * 1000;

    // Secure cookie options
    const cookieOptions = {
        httpOnly: true, // Prevents client-side JS access (XSS protection)
        secure: process.env.NODE_ENV === 'production', // Requires HTTPS in production
        sameSite: 'strict', // Helps protect against CSRF
        maxAge: maxAge, 
    };

    // Set the cookie
    res.cookie('access_token', token, cookieOptions);

    // Filter password out of user object
    const { password, ...userData } = user;

    // Send response
    return res.status(200).json({
        user: { ...userData, role },
        message,
    });
};