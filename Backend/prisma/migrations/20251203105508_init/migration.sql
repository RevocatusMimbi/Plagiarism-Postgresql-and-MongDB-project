-- CreateTable
CREATE TABLE "Admin" (
    "uid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "image" TEXT,
    "level" INTEGER,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Lecture" (
    "lid" SERIAL NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" INTEGER,
    "level" INTEGER,
    "image" TEXT,
    "cId" INTEGER,

    CONSTRAINT "Lecture_pkey" PRIMARY KEY ("lid")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT,
    "level" INTEGER,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "regno" TEXT NOT NULL,
    "fname" TEXT NOT NULL,
    "lname" TEXT NOT NULL,
    "email" TEXT,
    "level" INTEGER,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assignment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "courseId" INTEGER,
    "dueDate" TIMESTAMP(3),

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "assignmentId" INTEGER,
    "filename" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Takes" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "cid" INTEGER NOT NULL,
    "sid" TEXT NOT NULL,

    CONSTRAINT "Takes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Lecture_email_key" ON "Lecture"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_regno_key" ON "Student"("regno");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
