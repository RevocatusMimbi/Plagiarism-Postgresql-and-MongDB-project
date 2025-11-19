import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// IMPORTANT: Replace 'YOUR_SECRET_KEY' with a strong, complex secret key
// and ideally load it from a .env file (e.g., process.env.JWT_SECRET)
const JWT_SECRET = process.env.JWT_SECRET;

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
export const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: 'Identifier (Email/RegNo) and password are required.' });
  }

  try {
    const result = await findUserByCredentials(identifier, password);

    if (!result) {
      return res
        .status(401)
        .json({ message: 'Invalid credentials please try again.' });
    }

    const { user, role } = result;

    // Payload for the JWT token
    const token = jwt.sign(
      {
        id: user.uid || user.lid || user.regNo,
        email: user.email,
        role: role, // 'Admin', 'Lecture', or 'Student'
        level: user.level,
      },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    // Send token and user details (excluding password)
    const { password: _, ...userData } = user;

    return res.status(200).json({
      token,
      user: { ...userData, role },
      message: `${role} logged in successfully.`,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error during login.' });
  }
};

/**
 * Handles registration for all user types, differentiated by a 'role' field
 */
export const registerUser = async (req, res) => {
  const { role, password, email, fname, lname, regNo, level, image } = req.body;

  if (!role || !password || !email) {
    return res
      .status(400)
      .json({ message: 'Role, password, and email are required fields.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;
    let createData = {
      password: hashedPassword,
      level: level || (role === 'Student' ? 3 : 2), // Default levels based on schema data
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
      if (!regNo)
        return res.status(400).json({
          message: 'Registration number (regNo) is required for Students.',
        });

      createData = {
        ...createData,
        regNo,
        fname,
        lname,
        email: `${regNo}@student.com`,
        status: 1,
      };
      newUser = await prisma.student.create({ data: createData });
    } else {
      return res.status(400).json({ message: 'Invalid user role specified.' });
    }

    // Omit password from the response
    const { password: _, ...userData } = newUser;
    return res
      .status(201)
      .json({ message: `${role} registered successfully.`, user: userData });
  } catch (error) {
    if (error.code === 'P2002') {
      // Prisma unique constraint violation
      return res
        .status(409)
        .json({ message: 'User with this email or ID already exists.' });
    }
    console.error('Registration error:', error);
    return res
      .status(500)
      .json({ message: 'Internal server error during registration.' });
  }
};
