import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import type { JWTPayload, PaginationParams } from '../types/index.js';

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Cost factor for hashing
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token
 * @param payload - Data to encode in the token
 * @returns JWT token string
 */
export const generateToken = (payload: JWTPayload): string => {
  const secret: string = config.jwt.secret;
  return jwt.sign(payload, secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Verify and decode a JWT token
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, config.jwt.secret as string) as JWTPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Calculate pagination parameters
 * @param page - Page number (1-indexed)
 * @param limit - Items per page
 * @returns Pagination object with skip value
 */
export const getPagination = (
  page: number = 1,
  limit: number = 10,
): PaginationParams => {
  const pageNumber = Math.max(1, page); // Ensure page is at least 1
  const limitNumber = Math.max(1, Math.min(100, limit)); // Between 1 and 100

  return {
    page: pageNumber,
    limit: limitNumber,
    skip: (pageNumber - 1) * limitNumber,
  };
};

/**
 * Format date to ISO string
 * @param date - Date object or string
 * @returns ISO formatted date string
 */
export const formatDate = (date: Date | string): string => {
  return new Date(date).toISOString();
};

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns true if valid email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate registration number format
 * Examples: "283/BSC.SE/T/2018" or "RU/BSC/2019/012"
 * @param regNo - Registration number to validate
 * @returns true if valid format
 */
export const isValidRegNo = (regNo: string): boolean => {
  const regNoRegex =
    /^([0-9]{3,4}\/[A-Z]+(\.[A-Z]{2,3})*\/T\/20[0-9]{2})|(RU\/[A-Z]+(\.[A-Z]{2,3})*\/20[0-9]{2}\/[0-9]{3,4})$/;
  return regNoRegex.test(regNo);
};

/**
 * Sanitize user input by removing extra spaces
 * @param input - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

/**
 * Create a success response object
 * @param message - Success message
 * @param data - Response data
 * @returns Formatted response object
 */
export const successResponse = <T>(message: string, data?: T) => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Create an error response object
 * @param message - Error message
 * @param error - Error details
 * @returns Formatted error object
 */
export const errorResponse = (message: string, error?: any) => {
  return {
    success: false,
    message,
    error: error?.message || error,
  };
};
