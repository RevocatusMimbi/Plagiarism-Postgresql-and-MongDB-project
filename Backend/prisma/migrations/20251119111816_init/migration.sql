-- CreateTable
CREATE TABLE "admin" (
    "uid" SERIAL NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "email" VARCHAR(30) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "image" VARCHAR(100) NOT NULL,
    "level" INTEGER NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "facult" (
    "facId" SERIAL NOT NULL,
    "facName" VARCHAR(40) NOT NULL,

    CONSTRAINT "facult_pkey" PRIMARY KEY ("facId")
);

-- CreateTable
CREATE TABLE "lecture" (
    "lid" SERIAL NOT NULL,
    "fname" VARCHAR(30) NOT NULL,
    "lname" VARCHAR(30) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "status" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "image" VARCHAR(100) NOT NULL,
    "cId" INTEGER,

    CONSTRAINT "lecture_pkey" PRIMARY KEY ("lid")
);

-- CreateTable
CREATE TABLE "students" (
    "regNo" VARCHAR(30) NOT NULL,
    "fname" VARCHAR(30) NOT NULL,
    "lname" VARCHAR(30) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "image" VARCHAR(100) NOT NULL,
    "status" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "fid" INTEGER,

    CONSTRAINT "students_pkey" PRIMARY KEY ("regNo")
);

-- CreateTable
CREATE TABLE "assignments" (
    "aid" SERIAL NOT NULL,
    "name" VARCHAR(30) NOT NULL,
    "date" TIMESTAMP(0) NOT NULL,
    "submition" DATE NOT NULL,
    "CName" VARCHAR(30) NOT NULL,

    CONSTRAINT "assignments_pkey" PRIMARY KEY ("aid")
);

-- CreateTable
CREATE TABLE "comment" (
    "comId" SERIAL NOT NULL,
    "lower" INTEGER NOT NULL,
    "upper" INTEGER NOT NULL,
    "comm" VARCHAR(200) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("comId")
);

-- CreateTable
CREATE TABLE "cours" (
    "cid" SERIAL NOT NULL,
    "ccode" VARCHAR(10) NOT NULL,
    "courseName" VARCHAR(40) NOT NULL,
    "yos" VARCHAR(15) NOT NULL,
    "facultyId" INTEGER NOT NULL,
    "lecID" INTEGER,

    CONSTRAINT "cours_pkey" PRIMARY KEY ("cid")
);

-- CreateTable
CREATE TABLE "document" (
    "id" SERIAL NOT NULL,
    "dname" VARCHAR(60) NOT NULL,
    "asID" INTEGER NOT NULL,
    "studentID" VARCHAR(30) NOT NULL,

    CONSTRAINT "document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "takes" (
    "code" SERIAL NOT NULL,
    "cid" INTEGER NOT NULL,
    "sid" VARCHAR(30) NOT NULL,

    CONSTRAINT "takes_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "lecture_cId_fkey" FOREIGN KEY ("cId") REFERENCES "facult"("facId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_fid_fkey" FOREIGN KEY ("fid") REFERENCES "facult"("facId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "facult"("facId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cours" ADD CONSTRAINT "cours_lecID_fkey" FOREIGN KEY ("lecID") REFERENCES "lecture"("lid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_asID_fkey" FOREIGN KEY ("asID") REFERENCES "assignments"("aid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document" ADD CONSTRAINT "document_studentID_fkey" FOREIGN KEY ("studentID") REFERENCES "students"("regNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "takes" ADD CONSTRAINT "takes_sid_fkey" FOREIGN KEY ("sid") REFERENCES "students"("regNo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "takes" ADD CONSTRAINT "takes_cid_fkey" FOREIGN KEY ("cid") REFERENCES "cours"("cid") ON DELETE RESTRICT ON UPDATE CASCADE;
