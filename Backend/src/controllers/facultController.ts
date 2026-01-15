// src/controllers/faculty.controller.ts
import { Request, Response, NextFunction } from 'express';
import { FacultyService } from '../services/facultyService';
import { successResponse } from '../utils/helpers';

/**
 * Faculty Controller
 * Handles HTTP requests for faculty endpoints
 */
export class FacultyController {
  private facultyService: FacultyService;

  constructor() {
    this.facultyService = new FacultyService();
  }

  /**
   * Create new faculty
   * POST /api/faculties
   */
  createFaculty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const faculty = await this.facultyService.createFaculty(name);

      res
        .status(201)
        .json(successResponse('Faculty created successfully', faculty));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all faculties
   * GET /api/faculties
   */
  getAllFaculties = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.facultyService.getAllFaculties(page, limit);

      res
        .status(200)
        .json(successResponse('Faculties retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get faculty by ID
   * GET /api/faculties/:id
   */
  getFacultyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);

      const faculty = await this.facultyService.getFacultyById(id);

      res
        .status(200)
        .json(successResponse('Faculty retrieved successfully', faculty));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update faculty
   * PUT /api/faculties/:id
   */
  updateFaculty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const { name } = req.body;

      const faculty = await this.facultyService.updateFaculty(id, name);

      res
        .status(200)
        .json(successResponse('Faculty updated successfully', faculty));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete faculty
   * DELETE /api/faculties/:id
   */
  deleteFaculty = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);

      const result = await this.facultyService.deleteFaculty(id);

      res.status(200).json(successResponse(result.message));
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get faculty courses
   * GET /api/faculties/:id/courses
   */
  getFacultyCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = parseInt(req.params.id);

      const courses = await this.facultyService.getFacultyCourses(id);

      res
        .status(200)
        .json(
          successResponse('Faculty courses retrieved successfully', courses),
        );
    } catch (error) {
      next(error);
    }
  };
}
