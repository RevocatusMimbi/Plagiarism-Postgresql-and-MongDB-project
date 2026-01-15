import { Router } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';

const router = Router();

/**
 * GET /api/students
 * List students
 */
router.get('/', async (req, res) => {
  const students = await prisma.student.findMany({ include: { submissions: true } });
  res.json(students);
});

/**
 * POST /api/students
 * Create student
 */
const createStudentSchema = z.object({
  regno: z.string(),
  fname: z.string(),
  lname: z.string(),
  email: z.string().email().optional(),
  level: z.number().int().optional(),
});

router.post('/', async (req, res) => {
  try {
    const parsed = createStudentSchema.parse(req.body);
    const student = await prisma.student.create({ data: parsed });
    res.status(201).json(student);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
