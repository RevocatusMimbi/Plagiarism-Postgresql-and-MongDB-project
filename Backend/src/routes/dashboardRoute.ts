import { Router } from 'express';
import type { Request, Response } from 'express';
import prisma from '../config/database.js';

const router = Router();

// ============================================
// ADMIN DASHBOARD ENDPOINTS
// ============================================

// GET /api/dashboard/admin/counts - Fetches Faculty, Student, and Lecture counts
router.get('/admin/counts', async (req: Request, res: Response) => {
  try {
    const [facultyCount, studentCount, lecturerCount, documentCount, courseCount] = await Promise.all([
      prisma.faculty.count(),
      prisma.student.count(),
      prisma.lecturer.count(),
      prisma.document.count(),
      prisma.course.count(),
    ]);

    res.json({
      facultyCount,
      studentCount,
      lecturerCount,
      documentCount,
      courseCount,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard counts:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// GET /api/dashboard/admin/recent-submissions - Get recent submissions
router.get('/admin/recent-submissions', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const submissions = await prisma.document.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        student: {
          select: {
            regNo: true,
            firstName: true,
            lastName: true,
          },
        },
        assignment: {
          select: {
            name: true,
            course: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    // Format response (simulating plagiarism results since we don't have that data yet)
    const formattedSubmissions = submissions.map((doc) => ({
      id: doc.id,
      studentName: `${doc.student.firstName} ${doc.student.lastName}`,
      studentRegNo: doc.student.regNo,
      assignment: doc.assignment.name,
      course: doc.assignment.course.name,
      courseCode: doc.assignment.course.code,
      submittedAt: doc.createdAt,
      // Simulated similarity score (in production, this would come from plagiarism check)
      similarity: Math.floor(Math.random() * 100),
      status: Math.random() > 0.3 ? 'Pass' : Math.random() > 0.5 ? 'Flag' : 'Fail',
    }));

    res.json(formattedSubmissions);
  } catch (error) {
    console.error('Error fetching recent submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// GET /api/dashboard/admin/plagiarism-stats - Get plagiarism statistics
router.get('/admin/plagiarism-stats', async (req: Request, res: Response) => {
  try {
    const totalSubmissions = await prisma.document.count();

    // Simulated statistics (in production, these would be calculated from actual plagiarism data)
    const stats = {
      totalSubmissions,
      pendingChecks: Math.floor(totalSubmissions * 0.1),
      flagged: Math.floor(totalSubmissions * 0.15),
      cleared: Math.floor(totalSubmissions * 0.75),
      averageSimilarity: 18,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching plagiarism stats:', error);
    res.status(500).json({ error: 'Failed to fetch plagiarism statistics' });
  }
});

// ============================================
// LECTURER DASHBOARD ENDPOINTS
// ============================================

// GET /api/dashboard/lecturer/:id/stats - Get lecturer statistics
router.get('/lecturer/:id/stats', async (req: Request, res: Response) => {
  try {
    const lecturerId = parseInt(req.params.id);

    const lecturer = await prisma.lecturer.findUnique({
      where: { id: lecturerId },
      include: {
        courses: {
          include: {
            assignments: true,
            enrollments: true,
          },
        },
      },
    });

    if (!lecturer) {
      return res.status(404).json({ error: 'Lecturer not found' });
    }

    // Calculate stats
    const totalCourses = lecturer.courses.length;
    const totalStudents = new Set(
      lecturer.courses.flatMap((c) => c.enrollments.map((e) => e.studentRegNo))
    ).size;
    const totalAssignments = lecturer.courses.reduce(
      (acc, c) => acc + c.assignments.length,
      0
    );

    // Count pending submissions (documents for assignments that haven't been checked)
    const pendingChecks = await prisma.document.count({
      where: {
        assignment: {
          lecturerId: lecturerId,
        },
      },
    });

    res.json({
      lecturerId: lecturer.id,
      lecturerName: `${lecturer.firstName} ${lecturer.lastName}`,
      courses: totalCourses,
      students: totalStudents,
      assignments: totalAssignments,
      pendingChecks,
    });
  } catch (error) {
    console.error('Error fetching lecturer stats:', error);
    res.status(500).json({ error: 'Failed to fetch lecturer statistics' });
  }
});

// GET /api/dashboard/lecturer/:id/courses - Get lecturer's courses with details
router.get('/lecturer/:id/courses', async (req: Request, res: Response) => {
  try {
    const lecturerId = parseInt(req.params.id);

    const courses = await prisma.course.findMany({
      where: { lecturerId },
      include: {
        assignments: {
          include: {
            documents: true,
          },
        },
        enrollments: true,
        faculty: {
          select: {
            name: true,
          },
        },
      },
    });

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      code: course.code,
      name: course.name,
      yearOfStudy: course.yearOfStudy,
      faculty: course.faculty.name,
      students: course.enrollments.length,
      assignments: course.assignments.map((a) => ({
        id: a.id,
        name: a.name,
        submissionDate: a.submissionDate,
        submissions: a.documents.length,
      })),
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching lecturer courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/dashboard/lecturer/:id/recent-submissions - Get recent submissions for lecturer
router.get('/lecturer/:id/recent-submissions', async (req: Request, res: Response) => {
  try {
    const lecturerId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 10;

    const submissions = await prisma.document.findMany({
      where: {
        assignment: {
          lecturerId,
        },
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        student: {
          select: {
            regNo: true,
            firstName: true,
            lastName: true,
          },
        },
        assignment: {
          select: {
            name: true,
            course: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    const formattedSubmissions = submissions.map((doc) => ({
      id: doc.id,
      studentName: `${doc.student.firstName} ${doc.student.lastName}`,
      studentRegNo: doc.student.regNo,
      assignment: doc.assignment.name,
      course: doc.assignment.course.name,
      courseCode: doc.assignment.course.code,
      submittedAt: doc.createdAt,
      similarity: Math.floor(Math.random() * 100),
      status: Math.random() > 0.3 ? 'Pass' : Math.random() > 0.5 ? 'Flag' : 'Fail',
    }));

    res.json(formattedSubmissions);
  } catch (error) {
    console.error('Error fetching lecturer submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// ============================================
// STUDENT DASHBOARD ENDPOINTS
// ============================================

// GET /api/dashboard/student/:regNo/stats - Get student statistics
router.get('/student/:regNo/stats', async (req: Request, res: Response) => {
  try {
    const regNo = req.params.regNo;

    const student = await prisma.student.findUnique({
      where: { regNo },
      include: {
        enrollments: true,
        documents: {
          include: {
            assignment: true,
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Calculate stats
    const totalCourses = student.enrollments.length;
    const totalSubmissions = student.documents.length;
    const pendingAssignments = 3; // Would calculate based on due dates

    // Calculate average similarity (simulated)
    const averageSimilarity = 18;

    res.json({
      regNo: student.regNo,
      studentName: `${student.firstName} ${student.lastName}`,
      courses: totalCourses,
      submissions: totalSubmissions,
      pending: pendingAssignments,
      averageSimilarity,
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ error: 'Failed to fetch student statistics' });
  }
});

// GET /api/dashboard/student/:regNo/courses - Get student's enrolled courses
router.get('/student/:regNo/courses', async (req: Request, res: Response) => {
  try {
    const regNo = req.params.regNo;

    const enrollments = await prisma.enrollment.findMany({
      where: { studentRegNo: regNo },
      include: {
        course: {
          include: {
            lecturer: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            faculty: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const formattedCourses = enrollments.map((e) => ({
      id: e.course.id,
      code: e.course.code,
      name: e.course.name,
      yearOfStudy: e.course.yearOfStudy,
      faculty: e.course.faculty.name,
      lecturer: e.course.lecturer
        ? `${e.course.lecturer.firstName} ${e.course.lecturer.lastName}`
        : 'Not Assigned',
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/dashboard/student/:regNo/submissions - Get student's submission history
router.get('/student/:regNo/submissions', async (req: Request, res: Response) => {
  try {
    const regNo = req.params.regNo;
    const limit = parseInt(req.query.limit as string) || 10;

    const submissions = await prisma.document.findMany({
      where: { studentRegNo: regNo },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        assignment: {
          select: {
            id: true,
            name: true,
            submissionDate: true,
            course: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    const formattedSubmissions = submissions.map((doc) => ({
      id: doc.id,
      documentName: doc.name,
      assignment: doc.assignment.name,
      course: doc.assignment.course.name,
      courseCode: doc.assignment.course.code,
      dueDate: doc.assignment.submissionDate,
      submittedAt: doc.createdAt,
      similarity: Math.floor(Math.random() * 100),
      status: Math.random() > 0.3 ? 'Pass' : Math.random() > 0.5 ? 'Flag' : 'Fail',
    }));

    res.json(formattedSubmissions);
  } catch (error) {
    console.error('Error fetching student submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// GET /api/dashboard/student/:regNo/pending - Get student's pending assignments
router.get('/student/:regNo/pending', async (req: Request, res: Response) => {
  try {
    const regNo = req.params.regNo;

    // Get all assignments for courses the student is enrolled in
    const enrollments = await prisma.enrollment.findMany({
      where: { studentRegNo: regNo },
      include: {
        course: {
          include: {
            assignments: {
              where: {
                submissionDate: {
                  gte: new Date(),
                },
              },
            },
          },
        },
      },
    });

    // Get already submitted documents
    const submittedDocs = await prisma.document.findMany({
      where: { studentRegNo: regNo },
      select: { assignmentId: true },
    });
    const submittedIds = new Set(submittedDocs.map((d) => d.assignmentId));

    // Filter pending assignments
    const pendingAssignments: Array<{
      id: number;
      name: string;
      courseName: string;
      courseCode: string;
      dueDate: Date;
    }> = [];

    for (const enrollment of enrollments) {
      for (const assignment of enrollment.course.assignments) {
        if (!submittedIds.has(assignment.id)) {
          pendingAssignments.push({
            id: assignment.id,
            name: assignment.name,
            courseName: enrollment.course.name,
            courseCode: enrollment.course.code,
            dueDate: assignment.submissionDate,
          });
        }
      }
    }

    // Sort by due date
    pendingAssignments.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    res.json(pendingAssignments);
  } catch (error) {
    console.error('Error fetching pending assignments:', error);
    res.status(500).json({ error: 'Failed to fetch pending assignments' });
  }
});

export default router;

