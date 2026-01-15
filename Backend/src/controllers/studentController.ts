// src/controllers/student.controller.ts
import { type Request, type Response, type NextFunction } from 'express';
import { StudentService } from '../services/studentService';
import { successResponse } from '../utils/helpers';
import { AppError } from '../middleware/errorHandler';

/**
 * Student Controller
 * Handles HTTP requests for student endpoints
 */
export class StudentController {
  private studentService: StudentService;

  constructor() {
    this.studentService = new StudentService();
  }

  /**
   * Create new student
   * POST /api/students
   */
  createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { regNo, firstName, lastName, password } = req.body;

      const student = await this.studentService.createStudent({
        regNo,
        firstName,
        lastName,
        password,
      });

      res
        .status(201)
        .json(successResponse('Student created successfully', student));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all students
   * GET /api/students
   */
  getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.studentService.getAllStudents(page, limit);

      res
        .status(200)
        .json(successResponse('Students retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get student by ID
   * GET /api/students/:regNo
   */
  getStudentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { regNo } = req.params;

      if (!regNo) {
        throw new AppError('Registration number is required', 400);
      }

      const student = await this.studentService.getStudentById(regNo!);

      res
        .status(200)
        .json(successResponse('Student retrieved successfully', student));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update student
   * PUT /api/students/:regNo
   */
  updateStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { regNo } = req.params;

      if (!regNo) {
        throw new AppError('Registration number is required', 400);
      }

      const { firstName, lastName, image } = req.body;

      const student = await this.studentService.updateStudent(regNo!, {
        firstName,
        lastName,
        image,
      });

      res
        .status(200)
        .json(successResponse('Student updated successfully', student));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete student
   * DELETE /api/students/:regNo
   */
  deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { regNo } = req.params;

      if (!regNo) {
        throw new AppError('Registration number is required', 400);
      }

      const result = await this.studentService.deleteStudent(regNo!);

      res.status(200).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Suspend student
   * PATCH /api/students/:regNo/suspend
   */
  suspendStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { regNo } = req.params;

      if (!regNo) {
        throw new AppError('Registration number is required', 400);
      }

      const result = await this.studentService.suspendStudent(regNo!);

      res.status(200).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Unsuspend student
   * PATCH /api/students/:regNo/unsuspend
   */
  unsuspendStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { regNo } = req.params;

      if (!regNo) {
        throw new AppError('Registration number is required', 400);
      }

      const result = await this.studentService.unsuspendStudent(regNo!);

      res.status(200).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get student's courses
   * GET /api/students/:regNo/courses
   */
  getStudentCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { regNo } = req.params;

      if (!regNo) {
        throw new AppError('Registration number is required', 400);
      }

      const courses = await this.studentService.getStudentCourses(regNo!);

      res
        .status(200)
        .json(
          successResponse('Student courses retrieved successfully', courses),
        );
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get student's assignments
   * GET /api/students/:regNo/assignments
   */
  getStudentAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { regNo } = req.params;

      if (!regNo) {
        throw new AppError('Registration number is required', 400);
      }

      const assignments = await this.studentService.getStudentAssignments(
        regNo!,
      );

      res
        .status(200)
        .json(
          successResponse(
            'Student assignments retrieved successfully',
            assignments,
          ),
        );
    } catch (error) {
      next(error);
    }
  };
}
