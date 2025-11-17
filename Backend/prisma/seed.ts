import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- FACULT DATA ---
  await prisma.facult.createMany({
    data: [
      { facId: 9, facName: 'LAW' },
      { facId: 10, facName: 'FASS' },
      { facId: 12, facName: 'ICT' },
      { facId: 13, facName: 'FBMS' },
    ],
    skipDuplicates: true,
  });

  // --- LECTURE DATA ---
  await prisma.lecture.createMany({
    data: [
      {
        lid: 1,
        fname: 'Erick',
        lname: 'Mapingula',
        email: 'lecture@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        status: 1,
        level: 2,
        image: 'IMG_2837.jpeg',
        cId: null,
      },
      {
        lid: 2,
        fname: 'Victor',
        lname: 'Chrispin',
        email: 'victor@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        status: 1,
        level: 2,
        image: 'Screenshot from 2021-06-30 20-38-21.png',
        cId: null,
      },
      {
        lid: 3,
        fname: 'Josh',
        lname: 'Hezron',
        email: 'joh@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        status: 1,
        level: 2,
        image: 'avatarL.png',
        cId: null,
      },
      {
        lid: 4,
        fname: 'Nelly',
        lname: 'Titus',
        email: 'nelly@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        status: 1,
        level: 2,
        image: 'avatarL.png',
        cId: null,
      },
      {
        lid: 5,
        fname: 'Bobby',
        lname: 'sheddy',
        email: 'sheddy03@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        status: 1,
        level: 2,
        image: 'avatarL.png',
        cId: null,
      },
    ],
    skipDuplicates: true,
  });

  // --- STUDENTS DATA ---
  await prisma.student.createMany({
    data: [
      {
        regNo: '110/BSC/T/2017',
        fname: 'John',
        lname: 'Doe',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarL.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '111/BSC.SE/T/2018',
        fname: 'Chrispin',
        lname: 'Kadege',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'team4.jpg',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '117/BEHSIT/T/2017',
        fname: 'Keanu',
        lname: 'Reeves',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '117/BSC/T/2017',
        fname: 'Jane',
        lname: 'Doe',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '1217/BAED/T/2018',
        fname: 'Elizabeth',
        lname: 'Olsen',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '150/BSC/T/2018',
        fname: 'Frank',
        lname: 'Bwire',
        password: 'c33367701511b4f6020ec61ded352059',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '203/BSC.SE/T/2017',
        fname: 'Chriss',
        lname: 'Pratt',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '224/BSC.SE/T/2018',
        fname: 'Hugh',
        lname: 'Jackman',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '274/BSC.SE/T/2018',
        fname: 'Chriss',
        lname: 'Evans',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '283/BSC/T/2018',
        fname: 'Jennifer',
        lname: 'lawrence',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: '293/LLB/T/2018',
        fname: 'Angelina',
        lname: 'jolie',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
      {
        regNo: 'RU/BSC.ED/2020/283',
        fname: 'Michelle',
        lname: 'Rodrigues',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'avatarS.png',
        status: 1,
        level: 3,
        fid: null,
      },
    ],
    skipDuplicates: true,
  });

  // --- COURSE DATA ---
  await prisma.course.createMany({
    data: [
      {
        cid: 11,
        ccode: 'RCS 314',
        courseName: 'Computer security',
        yos: '2',
        facultyId: 12,
        lecID: 1,
      },
      {
        cid: 12,
        ccode: 'RCS 225',
        courseName: 'C programing',
        yos: '2',
        facultyId: 12,
        lecID: 1,
      },
      {
        cid: 13,
        ccode: 'RCS 115',
        courseName: 'Discrete structure',
        yos: '1',
        facultyId: 12,
        lecID: 1,
      },
      {
        cid: 14,
        ccode: 'RCS 121',
        courseName: 'Data structure',
        yos: '1',
        facultyId: 12,
        lecID: 1,
      },
      {
        cid: 18,
        ccode: 'RED 312',
        courseName: 'Phsychology II',
        yos: '3',
        facultyId: 10,
        lecID: null,
      },
      {
        cid: 21,
        ccode: 'RLB 235',
        courseName: 'Legislative',
        yos: '2',
        facultyId: 9,
        lecID: 1,
      },
      {
        cid: 22,
        ccode: 'RBS 216',
        courseName: 'Procurement Logistic',
        yos: '2',
        facultyId: 13,
        lecID: 1,
      },
      {
        cid: 23,
        ccode: 'RCS 112',
        courseName: 'descrete structure',
        yos: '3',
        facultyId: 12,
        lecID: 2,
      },
    ],
    skipDuplicates: true,
  });

  // --- ASSIGNMENTS DATA ---
  await prisma.assignment.createMany({
    data: [
      {
        aid: 6,
        name: 'Assignment 1',
        date: new Date('2021-08-08 04:18:26'),
        submition: new Date('2021-08-18'),
        CName: 'Computer security',
      },
      {
        aid: 7,
        name: 'Assignment 2',
        date: new Date('2021-08-08 04:18:49'),
        submition: new Date('2021-08-18'),
        CName: 'C programing',
      },
      {
        aid: 8,
        name: 'Assignment 3',
        date: new Date('2021-08-08 04:19:03'),
        submition: new Date('2021-09-26'),
        CName: 'Data structure',
      },
      {
        aid: 11,
        name: 'Assignment 4',
        date: new Date('2021-08-09 10:37:05'),
        submition: new Date('2021-09-30'),
        CName: 'C programing',
      },
      {
        aid: 15,
        name: 'Psycopath As II',
        date: new Date('2021-08-15 14:48:32'),
        submition: new Date('2021-08-18'),
        CName: 'Phsychology II',
      },
      {
        aid: 16,
        name: 'Matrix',
        date: new Date('2021-09-21 15:11:06'),
        submition: new Date('2021-10-30'),
        CName: 'descrete structure',
      },
    ],
    skipDuplicates: true,
  });

  // --- DOCUMENT DATA ---
  await prisma.document.createMany({
    data: [
      {
        id: 10,
        dname: 'assignment 1.docx',
        asID: 7,
        studentID: 'RU/BSC.ED/2020/283',
      },
      {
        id: 11,
        dname: 'assignment 2.docx',
        asID: 7,
        studentID: '150/BSC/T/2018',
      },
      {
        id: 12,
        dname: 'assignment 4.docx',
        asID: 7,
        studentID: '111/BSC.SE/T/2018',
      },
      {
        id: 14,
        dname: 'proposal_1.docx',
        asID: 7,
        studentID: '117/BSC/T/2017',
      },
      {
        id: 15,
        dname: 'View serializable.docx',
        asID: 7,
        studentID: '110/BSC/T/2017',
      },
      {
        id: 16,
        dname: 'COVER PAGE FOR PT (copy).docx',
        asID: 7,
        studentID: '283/BSC/T/2018',
      },
    ],
    skipDuplicates: true,
  });

  // --- TAKES DATA ---
  await prisma.take.createMany({
    data: [
      { code: 55, cid: 12, sid: '111/BSC.SE/T/2018' },
      { code: 71, cid: 11, sid: '111/BSC.SE/T/2018' },
      { code: 72, cid: 13, sid: '111/BSC.SE/T/2018' },
      { code: 73, cid: 14, sid: '111/BSC.SE/T/2018' },
      { code: 75, cid: 12, sid: 'RU/BSC.ED/2020/283' },
      { code: 76, cid: 12, sid: '150/BSC/T/2018' },
      { code: 78, cid: 11, sid: '117/BSC/T/2017' },
      { code: 79, cid: 12, sid: '117/BSC/T/2017' },
      { code: 80, cid: 13, sid: '117/BSC/T/2017' },
      { code: 81, cid: 14, sid: '117/BSC/T/2017' },
      { code: 82, cid: 12, sid: '110/BSC/T/2017' },
      { code: 84, cid: 14, sid: '110/BSC/T/2017' },
      { code: 85, cid: 11, sid: '283/BSC/T/2018' },
      { code: 86, cid: 12, sid: '283/BSC/T/2018' },
      { code: 93, cid: 14, sid: '283/BSC/T/2018' },
      { code: 101, cid: 18, sid: '110/BSC/T/2017' },
    ],
    skipDuplicates: true,
  });

  // --- ADMIN DATA ---
  await prisma.admin.createMany({
    data: [
      {
        uid: 10,
        name: 'Sheddy Titus',
        email: 'admin@gmail.com',
        password: 'e10adc3949ba59abbe56e057f20f883e',
        image: 'IMG_2848.jpeg',
        level: 1,
      },
    ],
    skipDuplicates: true,
  });

  // --- COMMENT DATA ---
  await prisma.comment.createMany({
    data: [
      { comId: 1, lower: 0, upper: 49, comm: 'Not similar' },
      { comId: 2, lower: 50, upper: 79, comm: 'Medium similar' },
      { comId: 3, lower: 80, upper: 100, comm: 'Completely Similar' },
    ],
    skipDuplicates: true,
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
