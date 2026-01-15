import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../config/database.js';

const router = Router();

// GET /api/dashboard/counts: Replaces the COUNT(*) logic in adminHome.php
router.get('/counts', async (req: Request, res: Response) => {
  try {
    const [facultyCount, studentCount, lectureCount] = await Promise.all([
      // Counting rows in the respective tables
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
