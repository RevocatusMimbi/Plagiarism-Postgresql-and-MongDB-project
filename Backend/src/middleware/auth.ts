// src/middleware/auth.ts
import type { Response, NextFunction } from 'express';
import type { AuthRequest } from '../types/index.js';
import { UserRole } from '../types/index.js';
import { verifyToken, errorResponse } from '../utils/helpers.js';

/**
 * Middleware to authenticate requests using JWT
 * Checks for token in Authorization header
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json(errorResponse('Access denied. No token provided.'));
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify and decode token
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json(errorResponse('Invalid or expired token.'));
    }

    // Attach user info to request object
    req.user = decoded;
    next(); // Continue to next middleware or route handler
  } catch (error) {
    return res.status(401).json(errorResponse('Authentication failed.', error));
  }
};

/**
 * Middleware to authorize specific roles
 * @param allowedRoles - Array of roles that can access the route
 * @returns Middleware function
 *
 * Usage: authorize([UserRole.ADMIN, UserRole.LECTURER])
 */
export const authorize = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json(errorResponse('Authentication required.'));
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json(errorResponse('Access forbidden. Insufficient permissions.'));
    }

    next(); // User is authorized
  };
};

/**
 * Middleware to check if user is an admin
 */
export const isAdmin = authorize([UserRole.ADMIN]);

/**
 * Middleware to check if user is a lecturer
 */
export const isLecturer = authorize([UserRole.LECTURER]);

/**
 * Middleware to check if user is a student
 */
export const isStudent = authorize([UserRole.STUDENT]);

/**
 * Middleware to check if user is admin or lecturer
 */
export const isAdminOrLecturer = authorize([UserRole.ADMIN, UserRole.LECTURER]);
