// controllers/authController.js

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
// Utility functions for JWT and token response
import { generateToken, sendTokenResponse } from '../utils/jwt.js'; 

const prisma = new PrismaClient();

// --- Helper function to find the user based on email or registration number ---
async function findUserByCredentials(identifier, password) {
  let user = null;
  let role = null;

  // 1. Check Admin Table (Uses email)
  user = await prisma.admin.findUnique({ where: { email: identifier } });
  if (user) role = 'Admin';

  // 2. Check Lecture Table (Uses email)
  if (!user) {
    user = await prisma.lecture.findUnique({ where: { email: identifier } });
    if (user) role = 'Lecture';
  }

  // 3. Check Student Table (Uses regNo as ID)
  if (!user) {
    user = await prisma.student.findUnique({ where: { regNo: identifier } });
    if (user) role = 'Student';
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    return { user, role };
  }

  return null; // Credentials invalid or user not found
}

// --- CONTROLLER FUNCTIONS ---

/**
 * Handles login for Admin, Lecture, and Student
 */
export const loginUser = async (req, res, next) => {
  const { identifier, password } = req.body;

  try {
    const result = await findUserByCredentials(identifier, password);

    if (!result) {
      // 401 Unauthorized error passed to central handler
      const err = new Error('Invalid credentials please try again.');
      err.statusCode = 401;
      return next(err);
    }

    const { user, role } = result;

    // 1. Generate token using utility
    const token = generateToken({
      id: user.uid || user.lid || user.regNo,
      email: user.email,
      role: role,
      level: user.level,
    });

    // 2. Send token as cookie using utility
    return sendTokenResponse(
      res,
      token,
      user,
      role,
      `${role} logged in successfully.`
    );
  } catch (error) {
    // Pass any unexpected errors (e.g., DB connection issues) to the error handler
    next(error);
  }
};

/**
 * Handles registration for all user types, differentiated by a 'role' field
 */
export const registerUser = async (req, res, next) => {
  // NOTE: Basic validation of required fields is now handled by Joi middleware.
  const { role, password, email, fname, lname, regNo, level, image } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    let createData = {
      password: hashedPassword,
      level: level || (role === 'Student' ? 3 : 2), // Default levels
      image: image || 'avatar.png',
    };

    if (role === 'Admin') {
      // Admin: Requires name, email, password, image, level
      createData = { ...createData, name: fname + ' ' + lname, email };
      newUser = await prisma.admin.create({ data: createData });
    } else if (role === 'Lecture') {
      // Lecture: Requires fname, lname, email, password, image, status, level
      createData = { ...createData, fname, lname, email, status: 1 };
      newUser = await prisma.lecture.create({ data: createData });
    } else if (role === 'Student') {
      // Student: Requires regNo (PK), fname, lname, password, image, status, level
      
      // Validation Check (redundant safety check, Joi handles primary validation)
      if (!regNo) { 
        const err = new Error('Registration number (regNo) is required for Students.');
        err.statusCode = 400;
        return next(err);
      } 
      
      // Corrected structure for createData for Student
      createData = {
        ...createData,
        regNo,
        fname,
        lname,
        email: `${regNo}@student.com`, // Auto-generate student email
        status: 1,
      };
      newUser = await prisma.student.create({ data: createData });
    } else {
      // Invalid Role
      const err = new Error('Invalid user role specified.');
      err.statusCode = 400;
      return next(err);
    }

    // Omit password from the response
    const { password: _, ...userData } = newUser;
    return res
      .status(201)
      .json({ message: `${role} registered successfully.`, user: userData });
  } catch (error) {
    // PASS ALL CATCHED ERRORS TO THE CENTRAL HANDLER
    // This allows errorHandler.js to handle P2002 (409 Conflict) and 500 errors.
    next(error); 
  }
};