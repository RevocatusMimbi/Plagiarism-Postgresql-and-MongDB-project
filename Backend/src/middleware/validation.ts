import type { Request, Response, NextFunction } from 'express';
import { isValidEmail, isValidRegNo, errorResponse } from '../utils/helpers.js';

/**
 * Validate login request
 */
export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json(errorResponse('Username and password are required'));
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json(errorResponse('Password must be at least 6 characters'));
  }

  next();
};

/**
 * Validate student creation
 */
export const validateCreateStudent = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { regNo, firstName, lastName, password } = req.body;

  // Check required fields
  if (!regNo || !firstName || !lastName || !password) {
    return res.status(400).json(errorResponse('All fields are required'));
  }

  // Validate registration number format
  if (!isValidRegNo(regNo)) {
    return res
      .status(400)
      .json(
        errorResponse(
          'Invalid registration number format. Example: 283/BSC.SE/T/2018',
        ),
      );
  }

  // Validate names (only letters)
  const nameRegex = /^[a-zA-Z]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return res
      .status(400)
      .json(errorResponse('Names should contain only letters'));
  }

  // Validate password length
  if (password.length < 6) {
    return res
      .status(400)
      .json(errorResponse('Password must be at least 6 characters'));
  }

  next();
};

/**
 * Validate lecturer creation
 */
export const validateCreateLecturer = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { firstName, lastName, email, password } = req.body;

  // Check required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json(errorResponse('All fields are required'));
  }

  // Validate names
  const nameRegex = /^[a-zA-Z]+$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    return res
      .status(400)
      .json(errorResponse('Names should contain only letters'));
  }

  // Validate email
  if (!isValidEmail(email)) {
    return res.status(400).json(errorResponse('Invalid email format'));
  }

  // Validate password
  if (password.length < 6) {
    return res
      .status(400)
      .json(errorResponse('Password must be at least 6 characters'));
  }

  next();
};

/**
 * Validate course creation
 */
export const validateCreateCourse = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { code, name, yearOfStudy, facultyId } = req.body;

  // Check required fields
  if (!code || !name || !yearOfStudy || !facultyId) {
    return res.status(400).json(errorResponse('All fields are required'));
  }

  // Validate course code format (letters and numbers)
  const codeRegex = /^[A-Z]{3}\s[0-9]{3}$/;
  if (!codeRegex.test(code)) {
    return res
      .status(400)
      .json(errorResponse('Invalid course code format. Example: RCS 314'));
  }

  // Validate faculty ID is a number
  if (isNaN(Number(facultyId))) {
    return res.status(400).json(errorResponse('Faculty ID must be a number'));
  }

  next();
};

/**
 * Validate assignment creation
 */
export const validateCreateAssignment = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, courseId, submissionDate } = req.body;

  // Check required fields
  if (!name || !courseId || !submissionDate) {
    return res.status(400).json(errorResponse('All fields are required'));
  }

  // Validate course ID
  if (isNaN(Number(courseId))) {
    return res.status(400).json(errorResponse('Course ID must be a number'));
  }

  // Validate submission date is in the future
  const subDate = new Date(submissionDate);
  if (isNaN(subDate.getTime())) {
    return res.status(400).json(errorResponse('Invalid date format'));
  }

  if (subDate < new Date()) {
    return res
      .status(400)
      .json(errorResponse('Submission date must be in the future'));
  }

  next();
};

/**
 * Validate faculty creation
 */
export const validateCreateFaculty = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json(errorResponse('Faculty name is required'));
  }

  // Validate name contains only letters and spaces
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(name)) {
    return res
      .status(400)
      .json(
        errorResponse('Faculty name should contain only letters and spaces'),
      );
  }

  next();
};
