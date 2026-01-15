// src/services/student.service.ts
import prisma from '../config/database';
import type { CreateStudentData } from '../types/index';
import { UserStatus } from '../types/index.js';
import { hashPassword, getPagination } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

/**
 * Student Service
 * Handles all student-related business logic
 */
export class StudentService {
  /**
   * Create a new student
   * @param data - Student creation data
   * @returns Created student (without password)
   */
  async createStudent(data: CreateStudentData) {
    const { regNo, firstName, lastName, password } = data;

    // Check if student already exists
    const existingStudent = await prisma.student.findUnique({
      where: { regNo },
    });

    if (existingStudent) {
      throw new AppError('Registration number already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create student
    const student = await prisma.student.create({
      data: {
        regNo,
        firstName,
        lastName,
        password: hashedPassword,
      },
      select: {
        regNo: true,
        firstName: true,
        lastName: true,
        image: true,
        status: true,
        createdAt: true,
      },
    });

    return student;
  }

  /**
   * Get all students with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of students
   */
  async getAllStudents(page: number = 1, limit: number = 10) {
    const pagination = getPagination(page, limit);

    // Get total count
    const total = await prisma.student.count();

    // Get students
    const students = await prisma.student.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      select: {
        regNo: true,
        firstName: true,
        lastName: true,
        image: true,
        status: true,
        createdAt: true,
        enrollments: {
          include: {
            course: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    return {
      students,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  /**
   * Get student by registration number
   * @param regNo - Student registration number
   * @returns Student details
   */
  async getStudentById(regNo: string) {
    const student = await prisma.student.findUnique({
      where: { regNo },
      select: {
        regNo: true,
        firstName: true,
        lastName: true,
        image: true,
        status: true,
        createdAt: true,
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                code: true,
                name: true,
                yearOfStudy: true,
                faculty: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        documents: {
          include: {
            assignment: {
              select: {
                name: true,
                courseName: true,
                submissionDate: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    return student;
  }

  /**
   * Update student information
   * @param regNo - Student registration number
   * @param data - Updated data
   * @returns Updated student
   */
  async updateStudent(
    regNo: string,
    data: Partial<{ firstName: string; lastName: string; image: string }>,
  ) {
    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { regNo },
    });

    if (!existingStudent) {
      throw new AppError('Student not found', 404);
    }

    // Update student
    const student = await prisma.student.update({
      where: { regNo },
      data,
      select: {
        regNo: true,
        firstName: true,
        lastName: true,
        image: true,
        status: true,
        createdAt: true,
      },
    });

    return student;
  }

  /**
   * Delete student
   * @param regNo - Student registration number
   */
  async deleteStudent(regNo: string) {
    // Check if student exists
    const student = await prisma.student.findUnique({
      where: { regNo },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    // Delete student (cascades to enrollments and documents)
    await prisma.student.delete({
      where: { regNo },
    });

    return { message: 'Student deleted successfully' };
  }

  /**
   * Suspend student account
   * @param regNo - Student registration number
   */
  async suspendStudent(regNo: string) {
    const student = await prisma.student.findUnique({
      where: { regNo },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    await prisma.student.update({
      where: { regNo },
      data: { status: UserStatus.SUSPENDED },
    });

    return { message: 'Student account suspended' };
  }

  /**
   * Unsuspend student account
   * @param regNo - Student registration number
   */
  async unsuspendStudent(regNo: string) {
    const student = await prisma.student.findUnique({
      where: { regNo },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    await prisma.student.update({
      where: { regNo },
      data: { status: UserStatus.ACTIVE },
    });

    return { message: 'Student account activated' };
  }

  /**
   * Get student's enrolled courses
   * @param regNo - Student registration number
   * @returns List of enrolled courses
   */
  async getStudentCourses(regNo: string) {
    const student = await prisma.student.findUnique({
      where: { regNo },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                faculty: true,
                lecturer: {
                  select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    return student.enrollments.map((e) => e.course);
  }

  /**
   * Get student's assignments
   * @param regNo - Student registration number
   * @returns List of assignments
   */
  async getStudentAssignments(regNo: string) {
    const student = await prisma.student.findUnique({
      where: { regNo },
    });

    if (!student) {
      throw new AppError('Student not found', 404);
    }

    // Get all assignments for enrolled courses
    const assignments = await prisma.assignment.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              studentRegNo: regNo,
            },
          },
        },
      },
      include: {
        course: {
          select: {
            name: true,
            code: true,
          },
        },
        documents: {
          where: {
            studentRegNo: regNo,
          },
          select: {
            id: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        submissionDate: 'asc',
      },
    });

    return assignments;
  }
}
