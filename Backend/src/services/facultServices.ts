// src/services/faculty.service.ts
import prisma from '../config/database';
import { getPagination } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

/**
 * Faculty Service
 * Handles all faculty-related business logic
 */
export class FacultyService {
  /**
   * Create a new faculty
   * @param name - Faculty name
   * @returns Created faculty
   */
  async createFaculty(name: string) {
    // Check if faculty already exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { name },
    });

    if (existingFaculty) {
      throw new AppError('Faculty already exists', 409);
    }

    // Create faculty
    const faculty = await prisma.faculty.create({
      data: { name },
    });

    return faculty;
  }

  /**
   * Get all faculties with pagination
   * @param page - Page number
   * @param limit - Items per page
   * @returns Paginated list of faculties
   */
  async getAllFaculties(page: number = 1, limit: number = 10) {
    const pagination = getPagination(page, limit);

    // Get total count
    const total = await prisma.faculty.count();

    // Get faculties with course count
    const faculties = await prisma.faculty.findMany({
      skip: pagination.skip,
      take: pagination.limit,
      include: {
        courses: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform to include course count
    const facultiesWithCount = faculties.map((faculty) => ({
      id: faculty.id,
      name: faculty.name,
      createdAt: faculty.createdAt,
      courseCount: faculty.courses.length,
    }));

    return {
      faculties: facultiesWithCount,
      pagination: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  /**
   * Get faculty by ID
   * @param id - Faculty ID
   * @returns Faculty details with courses
   */
  async getFacultyById(id: number) {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            lecturer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            enrollments: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    // Add student count to each course
    const coursesWithCount = faculty.courses.map((course) => ({
      ...course,
      studentCount: course.enrollments.length,
      enrollments: undefined, // Remove enrollments from response
    }));

    return {
      ...faculty,
      courses: coursesWithCount,
    };
  }

  /**
   * Update faculty name
   * @param id - Faculty ID
   * @param name - New name
   * @returns Updated faculty
   */
  async updateFaculty(id: number, name: string) {
    // Check if faculty exists
    const existingFaculty = await prisma.faculty.findUnique({
      where: { id },
    });

    if (!existingFaculty) {
      throw new AppError('Faculty not found', 404);
    }

    // Check if new name is already taken
    if (name !== existingFaculty.name) {
      const nameTaken = await prisma.faculty.findUnique({
        where: { name },
      });

      if (nameTaken) {
        throw new AppError('Faculty name already exists', 409);
      }
    }

    // Update faculty
    const faculty = await prisma.faculty.update({
      where: { id },
      data: { name },
    });

    return faculty;
  }

  /**
   * Delete faculty
   * @param id - Faculty ID
   */
  async deleteFaculty(id: number) {
    // Check if faculty exists
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        courses: true,
      },
    });

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    // Check if faculty has courses
    if (faculty.courses.length > 0) {
      throw new AppError(
        'Cannot delete faculty with existing courses. Delete or reassign courses first.',
        400,
      );
    }

    // Delete faculty
    await prisma.faculty.delete({
      where: { id },
    });

    return { message: 'Faculty deleted successfully' };
  }

  /**
   * Get faculty courses
   * @param id - Faculty ID
   * @returns List of courses in the faculty
   */
  async getFacultyCourses(id: number) {
    const faculty = await prisma.faculty.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            lecturer: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
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

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    return faculty.courses.map((course) => ({
      ...course,
      studentCount: course.enrollments.length,
      enrollments: undefined,
    }));
  }
}
