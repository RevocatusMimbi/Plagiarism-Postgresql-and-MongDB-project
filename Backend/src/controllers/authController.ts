// src/controllers/auth.controller.ts
import type { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService.js';
import type { AuthRequest } from '../types/index.js';
import { successResponse, errorResponse } from '../utils/helpers.js';

/**
 * Authentication Controller
 * Handles HTTP requests for authentication endpoints
 */
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Login endpoint
   * POST /api/auth/login
   */
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const result = await this.authService.login(username, password);

      res.status(200).json(successResponse('Login successful', result));
    } catch (error) {
      next(error); // Pass to error handler middleware
    }
  };

  /**
   * Get current user profile
   * GET /api/auth/me
   */
  getCurrentUser = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      // User info is attached by authenticate middleware
      const { id, role } = req.user!;

      const user = await this.authService.getCurrentUser(id, role);

      res.status(200).json(successResponse('User profile retrieved', user));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change password endpoint
   * PUT /api/auth/change-password
   */
  changePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const { id, role } = req.user!;

      // Validate passwords
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json(errorResponse('All fields are required'));
      }

      if (newPassword.length < 6) {
        return res
          .status(400)
          .json(errorResponse('New password must be at least 6 characters'));
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(400)
          .json(
            errorResponse('New password and confirm password do not match'),
          );
      }

      await this.authService.changePassword(id, role, oldPassword, newPassword);

      res.status(200).json(successResponse('Password changed successfully'));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout endpoint (client-side should delete token)
   * POST /api/auth/logout
   */
  logout = async (req: Request, res: Response) => {
    // With JWT, logout is handled on client by deleting token
    res.status(200).json(successResponse('Logout successful'));
  };
}
