import { Router } from 'express';
import multer from 'multer';
import prisma from '../lib/prisma';
import { jaccardSimilarity } from '../lib/plagiarism';
import fs from 'fs/promises';
import path from 'path';

const router = Router();
const upload = multer({ dest: 'uploads/' });

/**
 * POST /api/submissions/upload
 * Accept either raw 'content' in JSON or a 'file' (plain .txt). Associate to studentId.
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const studentId = Number(req.body.studentId);
    const assignmentId = req.body.assignmentId ? Number(req.body.assignmentId) : undefined;
    let content = req.body.content;

    if (!content && req.file) {
      // only handle text files for now
      const txt = await fs.readFile(req.file.path, 'utf-8');
      content = txt;
      // cleanup uploaded file
      await fs.unlink(req.file.path);
    }

    if (!studentId || !content) {
      return res.status(400).json({ error: 'studentId and content (or file) are required' });
    }

    const submission = await prisma.submission.create({
      data: {
        studentId,
        assignmentId,
        filename: req.file ? req.file.originalname : null,
        content,
      },
    });

    res.status(201).json(submission);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'server error', details: err.message });
  }
});

/**
 * GET /api/submissions/:id
 */
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const sub = await prisma.submission.findUnique({ where: { id }, include: { student: true } });
  if (!sub) return res.status(404).json({ error: 'not found' });
  res.json(sub);
});

/**
 * POST /api/submissions/compare
 * body: { aId: number, bId: number }
 * Returns a simple Jaccard similarity score between two submissions' contents.
 */
router.post('/compare', async (req, res) => {
  const { aId, bId } = req.body;
  if (!aId || !bId) return res.status(400).json({ error: 'aId and bId required' });

  const [a, b] = await Promise.all([
    prisma.submission.findUnique({ where: { id: Number(aId) } }),
    prisma.submission.findUnique({ where: { id: Number(bId) } }),
  ]);

  if (!a || !b) return res.status(404).json({ error: 'one or both submissions not found' });

  const result = jaccardSimilarity(a.content, b.content);
  res.json({ aId, bId, result });
});

/**
 * GET /api/submissions
 * list latest submissions
 */
router.get('/', async (req, res) => {
  const subs = await prisma.submission.findMany({ orderBy: { createdAt: 'desc' }, take: 50, include: { student: true } });
  res.json(subs);
});

export default router;
