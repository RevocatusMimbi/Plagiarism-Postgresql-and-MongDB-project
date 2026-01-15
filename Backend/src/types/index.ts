import type { Request } from 'express';

/**
 * User roles in the system
 */
export enum UserRole {
  ADMIN = 'admin',
  LECTURER = 'lecturer',
  STUDENT = 'student',
}

/**
 * User status
 */
export enum UserStatus {
  ACTIVE = 1,
  SUSPENDED = 0,
}

/**
 * Payload stored in JWT token
 */
export interface JWTPayload {
  id: string | number;
  role: UserRole;
  email?: string;
}

/**
 * Extended Express Request with user information
 * This adds the user property to the Request type
 */
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * Login Request Body
 */
export interface LoginBody {
  username: string;
  password: string;
}

/**
 * Standard API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

/**
 * Student creation data
 */
export interface CreateStudentData {
  regNo: string;
  firstName: string;
  lastName: string;
  password: string;
}

/**
 * Lecturer creation data
 */
export interface CreateLecturerData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/**
 * Course creation data
 */
export interface CreateCourseData {
  code: string;
  name: string;
  yearOfStudy: string;
  facultyId: number;
  lecturerId?: number;
}

/**
 * Assignment creation data
 */
export interface CreateAssignmentData {
  name: string;
  courseId: number;
  courseName: string;
  submissionDate: Date;
}
