import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin
  const hashedPassword = await bcrypt.hash('123456', 10);

  const admin = await prisma.admin.create({
    data: {
      name: 'Sheddy Titus',
      email: 'admin@gmail.com',
      password: hashedPassword,
      image: 'IMG_2848.jpeg',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create Faculties
  const faculties = await Promise.all([
    prisma.faculty.create({ data: { name: 'LAW' } }),
    prisma.faculty.create({ data: { name: 'FASS' } }),
    prisma.faculty.create({ data: { name: 'ICT' } }),
    prisma.faculty.create({ data: { name: 'FBMS' } }),
  ]);
  console.log('✅ Faculties created:', faculties.length);

  // Create Lecturers
  const lecturers = await Promise.all([
    prisma.lecturer.create({
      data: {
        firstName: 'Erick',
        lastName: 'Mapingula',
        email: 'lecture@gmail.com',
        password: hashedPassword,
        image: 'IMG_2837.jpeg',
      },
    }),
    prisma.lecturer.create({
      data: {
        firstName: 'Victor',
        lastName: 'Chrispin',
        email: 'victor@gmail.com',
        password: hashedPassword,
      },
    }),
  ]);
  console.log('✅ Lecturers created:', lecturers.length);

  // Create Courses
  const ictFaculty = faculties.find((f) => f.name === 'ICT');
  if (ictFaculty) {
    const courses = await Promise.all([
      prisma.course.create({
        data: {
          code: 'RCS 314',
          name: 'Computer Security',
          yearOfStudy: '2',
          facultyId: ictFaculty.id,
          lecturerId: lecturers[0].id,
        },
      }),
      prisma.course.create({
        data: {
          code: 'RCS 225',
          name: 'C Programming',
          yearOfStudy: '2',
          facultyId: ictFaculty.id,
          lecturerId: lecturers[0].id,
        },
      }),
      prisma.course.create({
        data: {
          code: 'RCS 121',
          name: 'Data Structure',
          yearOfStudy: '1',
          facultyId: ictFaculty.id,
          lecturerId: lecturers[0].id,
        },
      }),
    ]);
    console.log('✅ Courses created:', courses.length);

    // Create Students
    const students = await Promise.all([
      prisma.student.create({
        data: {
          regNo: '111/BSC.SE/T/2018',
          firstName: 'Chrispin',
          lastName: 'Kadege',
          password: hashedPassword,
          image: 'team4.jpg',
        },
      }),
      prisma.student.create({
        data: {
          regNo: 'RU/BSC.ED/2020/283',
          firstName: 'Michelle',
          lastName: 'Rodrigues',
          password: hashedPassword,
        },
      }),
      prisma.student.create({
        data: {
          regNo: '150/BSC/T/2018',
          firstName: 'Frank',
          lastName: 'Bwire',
          password: hashedPassword,
        },
      }),
    ]);
    console.log('✅ Students created:', students.length);

    // Create Assignments
    const assignment = await prisma.assignment.create({
      data: {
        name: 'Assignment 1',
        courseId: courses[1].id,
        courseName: courses[1].name,
        submissionDate: new Date('2025-12-31'),
      },
    });
    console.log('✅ Assignment created:', assignment.name);

    // Create Enrollments
    await Promise.all(
      students
        .map((student) =>
          courses.map((course) =>
            prisma.enrollment.create({
              data: {
                courseId: course.id,
                studentRegNo: student.regNo,
              },
            }),
          ),
        )
        .flat(),
    );
    console.log('✅ Enrollments created');

    // Create Comment ranges
    await Promise.all([
      prisma.comment.create({
        data: {
          lowerLimit: 0,
          upperLimit: 49,
          comment: 'Not similar',
        },
      }),
      prisma.comment.create({
        data: {
          lowerLimit: 50,
          upperLimit: 79,
          comment: 'Medium similar',
        },
      }),
      prisma.comment.create({
        data: {
          lowerLimit: 80,
          upperLimit: 100,
          comment: 'Completely Similar',
        },
      }),
    ]);
    console.log('✅ Comments created');
  }

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
