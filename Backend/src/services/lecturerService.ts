// src/services/lecturer.service.ts
import prisma from '../config/database';
import type { CreateLecturerData } from '../types/index';
import { UserStatus } from '../types/index.js';
import { hashPassword, getPagination } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

/**
 * Lecturer Service
 * Handles all lecturer-related business logic
 */
export class LecturerService {
  /**
   * Create a new lecturer
   * @param data - Lecturer creation data
   * @returns Created lecturer (without password)
   */
  async createLecturer(data: CreateLecturerData) {
    const { firstName, lastName, email, password } = data;

    // Check if lecturer already exists
    const existingLecturer = await prisma.lecturer.findUnique({
      where: { email },
    });

    if (existingLecturer) {
      throw new AppError('Email already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create lecturer
    const lecturer = await prisma.lecturer.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
      },
    });

    return lecturer;
  }

  /**
   * Get all lecturers with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of lecturers
   */
  async getAllLecturers(page: number = 1, limit: number = 10) {
    const pagination = getPagination(page, limit);

    // Get total count
    const total = await prisma.lecturer.count();

    // Get lecturers
    const lecturers = await prisma.lecturer.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
        courses: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        firstName: 'asc',
      },
    });

    return {
      lecturers,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  /**
   * Get lecturer by ID
   * @param id - Lecturer ID
   * @returns Lecturer details
   */
  async getLecturerById(id: number) {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
        courses: {
          include: {
            faculty: {
              select: {
                name: true,
              },
            },
            assignments: {
              select: {
                id: true,
                name: true,
                submissionDate: true,
              },
            },
          },
        },
      },
    });

    if (!lecturer) {
      throw new AppError('Lecturer not found', 404);
    }

    return lecturer;
  }

  /**
   * Update lecturer information
   * @param id - Lecturer ID
   * @param data - Updated data
   * @returns Updated lecturer
   */
  async updateLecturer(
    id: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      image: string;
    }>,
  ) {
    // Check if lecturer exists
    const existingLecturer = await prisma.lecturer.findUnique({
      where: { id },
    });

    if (!existingLecturer) {
      throw new AppError('Lecturer not found', 404);
    }

    // If email is being updated, check it's not taken
    if (data.email && data.email !== existingLecturer.email) {
      const emailTaken = await prisma.lecturer.findUnique({
        where: { email: data.email },
      });

      if (emailTaken) {
        throw new AppError('Email already in use', 409);
      }
    }

    // Update lecturer
    const lecturer = await prisma.lecturer.update({
      where: { id },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        status: true,
        createdAt: true,
      },
    });

    return lecturer;
  }

  /**
   * Delete lecturer
   * @param id - Lecturer ID
   */
  async deleteLecturer(id: number) {
    // Check if lecturer exists
    const lecturer = await prisma.lecturer.findUnique({
      where: { id },
    });

    if (!lecturer) {
      throw new AppError('Lecturer not found', 404);
    }

    // Delete lecturer (courses' lecturerId will be set to null)
    await prisma.lecturer.delete({
      where: { id },
    });

    return { message: 'Lecturer deleted successfully' };
  }

  /**
   * Suspend lecturer account
   * @param id - Lecturer ID
   */
  async suspendLecturer(id: number) {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id },
    });

    if (!lecturer) {
      throw new AppError('Lecturer not found', 404);
    }

    await prisma.lecturer.update({
      where: { id },
      data: { status: UserStatus.SUSPENDED },
    });

    return { message: 'Lecturer account suspended' };
  }

  /**
   * Unsuspend lecturer account
   * @param id - Lecturer ID
   */
  async unsuspendLecturer(id: number) {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id },
    });

    if (!lecturer) {
      throw new AppError('Lecturer not found', 404);
    }

    await prisma.lecturer.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
    });

    return { message: 'Lecturer account activated' };
  }

  /**
   * Get lecturer's courses
   * @param id - Lecturer ID
   * @returns List of courses
   */
  async getLecturerCourses(id: number) {
    const lecturer = await prisma.lecturer.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            faculty: true,
            enrollments: {
              select: {
                id: true,
              },
            },
            assignments: {
              select: {
                id: true,
                name: true,
                submissionDate: true,
              },
            },
          },
        },
      },
    });

    if (!lecturer) {
      throw new AppError('Lecturer not found', 404);
    }

    return lecturer.courses.map((course) => ({
      ...course,
      studentCount: course.enrollments.length,
      enrollments: undefined, // Remove enrollments from response
    }));
  }
}
