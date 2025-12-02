import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { validate, loginSchema, registerSchema } from '../utils/validators.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Universal registration endpoint. Requires a 'role' field (Admin, Lecture, Student) in the body.
 */
router.post('/register',validate(registerSchema),  registerUser);

/**
 * POST /api/auth/login
 * Universal login endpoint. Uses 'identifier' which can be email (for Admin/Lecture) or regNo (for Student).
 */
router.post('/login',validate(loginSchema), loginUser);

export default router;
