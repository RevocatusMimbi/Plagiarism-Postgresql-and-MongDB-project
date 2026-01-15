// src/services/auth.service.ts
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { UserRole, UserStatus } from '../types/index.js';
import { comparePassword, generateToken } from '../utils/helpers.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Authentication Service
 * Handles all authentication-related business logic
 */
export class AuthService {
  /**
   * Login user and generate JWT token
   * @param username - Email or registration number
   * @param password - Plain text password
   * @returns User data and JWT token
   */
  async login(username: string, password: string) {
    // Try to find user in different tables
    let user: any = null;
    let role: UserRole | undefined;
    let id: string | number | undefined;

    // 1. Check if it's a lecturer (email format)
    if (username.includes('@')) {
      user = await prisma.lecturer.findUnique({
        where: { email: username },
      });

      if (user) {
        role = UserRole.LECTURER;
        id = user.id;
      }
    }

    // 2. Check if it's an admin
    if (!user && username.includes('@')) {
      user = await prisma.admin.findUnique({
        where: { email: username },
      });

      if (user) {
        role = UserRole.ADMIN;
        id = user.id;
      }
    }

    // 3. Check if it's a student (registration number)
    if (!user) {
      user = await prisma.student.findUnique({
        where: { regNo: username },
      });

      if (user) {
        role = UserRole.STUDENT;
        id = user.regNo;
      }
    }

    // User not found
    if (!user) {
      throw new AppError('Invalid username or password', 401);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid username or password', 401);
    }

    // Check if account is suspended (only for students and lecturers)
    if ('status' in user && user.status === UserStatus.SUSPENDED) {
      throw new AppError(
        'Your account has been suspended. Contact admin.',
        403,
      );
    }

    // Generate JWT token
    const token = generateToken({
      id: id!,
      role: role!,
      email: user.email || undefined,
    });

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        role: role!,
      },
      token,
    };
  }

  /**
   * Get current user profile
   * @param userId - User ID
   * @param userRole - User role
   * @returns User profile data
   */
  async getCurrentUser(userId: string | number, userRole: UserRole) {
    let user: any;

    switch (userRole) {
      case UserRole.ADMIN:
        user = await prisma.admin.findUnique({
          where: { id: Number(userId) },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        });
        break;

      case UserRole.LECTURER:
        user = await prisma.lecturer.findUnique({
          where: { id: Number(userId) },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            status: true,
            courses: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            createdAt: true,
          },
        });
        break;

      case UserRole.STUDENT:
        user = await prisma.student.findUnique({
          where: { regNo: String(userId) },
          select: {
            regNo: true,
            firstName: true,
            lastName: true,
            image: true,
            status: true,
            enrollments: {
              include: {
                course: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
            createdAt: true,
          },
        });
        break;

      default:
        throw new AppError('Invalid user role', 400);
    }

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return { ...user, role: userRole };
  }

  /**
   * Change user password
   * @param userId - User ID
   * @param userRole - User role
   * @param oldPassword - Current password
   * @param newPassword - New password
   */
  async changePassword(
    userId: string | number,
    userRole: UserRole,
    oldPassword: string,
    newPassword: string,
  ) {
    // Fetch user based on role
    let user: any;

    switch (userRole) {
      case UserRole.ADMIN:
        user = await prisma.admin.findUnique({
          where: { id: Number(userId) },
        });
        break;
      case UserRole.LECTURER:
        user = await prisma.lecturer.findUnique({
          where: { id: Number(userId) },
        });
        break;
      case UserRole.STUDENT:
        user = await prisma.student.findUnique({
          where: { regNo: String(userId) },
        });
        break;
    }

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify old password
    const isOldPasswordValid = await comparePassword(
      oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Check if new password is different from old
    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      throw new AppError(
        'New password must be different from current password',
        400,
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password based on role
    switch (userRole) {
      case UserRole.ADMIN:
        await prisma.admin.update({
          where: { id: Number(userId) },
          data: { password: hashedPassword },
        });
        break;
      case UserRole.LECTURER:
        await prisma.lecturer.update({
          where: { id: Number(userId) },
          data: { password: hashedPassword },
        });
        break;
      case UserRole.STUDENT:
        await prisma.student.update({
          where: { regNo: String(userId) },
          data: { password: hashedPassword },
        });
        break;
    }

    return { message: 'Password changed successfully' };
  }
}
