import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../config/database.js';

const router = Router();

// GET /api/dashboard/counts: Fetches Faculty, Student, and Lecture counts
//it acts as the first page when admin dashboard is loaded.
router.get('/counts', async (req: Request, res: Response) => {
  try {
    // Replaces: SELECT * FROM `facult`, `students`, `lecture`
    const [facultyCount, studentCount, lectureCount] = await Promise.all([
      prisma.faculty.count(),
      prisma.student.count(),
      prisma.lecturer.count(),
    ]);

    res.json({
      facultyCount,
      studentCount,
      lectureCount,
    });
  } catch (error) {
    console.error('Error fetching dashboard counts:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
