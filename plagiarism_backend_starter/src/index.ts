import express from 'express';
import dotenv from 'dotenv';
import studentsRouter from './routes/students';
import submissionsRouter from './routes/submissions';
import prisma from './lib/prisma';

dotenv.config();
const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/students', studentsRouter);
app.use('/api/submissions', submissionsRouter);

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  console.log(`Server listening on http://localhost:${port}`);
  // verify DB connection
  try {
    await prisma.$connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Prisma connection error', err);
  }
});
