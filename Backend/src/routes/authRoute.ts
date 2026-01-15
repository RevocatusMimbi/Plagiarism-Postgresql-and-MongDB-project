// src/routes/auth.routes.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validateLogin } from '../middleware/validation.js';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private (requires authentication)
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.put('/change-password', authenticate, authController.changePassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client deletes token)
 * @access  Public
 */
router.post('/logout', authController.logout);

export default router;
