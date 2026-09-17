import mongoose from 'mongoose';
import User from '../models/User.js';
import Notice from '../models/Notice.js';
import { Timetable, Syllabus, Assignment, ExamSchedule, Result } from '../models/Academic.js';
import Resource from '../models/Resource.js';
import CampusGuide from '../models/CampusGuide.js';
import Club from '../models/Club.js';
import { PlacementDrive, PlacementResource } from '../models/Placement.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Task from '../models/Task.js';

// V3 Models
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import TeachingAssignment from '../models/TeachingAssignment.js';
import AssessmentConfig from '../models/AssessmentConfig.js';
import StudentMarks from '../models/StudentMarks.js';
import V3Result from '../models/V3Result.js';
import { calculateSubjectPerformance, recalculateClassResults } from '../controllers/academicCoreController.js';

export const seedDatabase = async () => {
  try {
    const courseCount = await Course.countDocuments();
    if (courseCount > 0) {
      console.log('[Seed] V3 Database already seeded. Skipping.');
      return;
    }

    console.log('[Seed] Seeding V3 CampusOne Academic Core & Examination Data...');

    // 1. V3 Courses
    const courses = await Course.insertMany([
      { code: 'BCOM', name: 'Bachelor of Commerce', description: 'Commerce, Accounting & Business Finance', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BSCIT', name: 'B.Sc. Information Technology', description: 'Software Engineering, DBMS & Networks', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BMS', name: 'Bachelor of Management Studies', description: 'Business Management & Leadership', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BAF', name: 'Bachelor of Accounting and Finance', description: 'Financial Analysis & Auditing', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BMM', name: 'Bachelor of Mass Media', description: 'Journalism, Advertising & Public Relations', totalSemesters: 6, divisions: ['A', 'B'] }
    ]);

    // 2. V3 Subjects
    const subjects = await Subject.insertMany([
      // BCOM Sem 3 Subjects
      { code: 'BCOM-301', name: 'Business Communication', course: 'BCOM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BCOM-302', name: 'Corporate Accounting', course: 'BCOM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BCOM-303', name: 'Business Economics III', course: 'BCOM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },
      { code: 'BCOM-304', name: 'Commercial Law', course: 'BCOM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // BSCIT Sem 3 Subjects
      { code: 'BSCIT-301', name: 'Business Communication', course: 'BSCIT', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },
      { code: 'BSCIT-302', name: 'Database Management Systems', course: 'BSCIT', semester: 3, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'BSCIT-303', name: 'Python Programming', course: 'BSCIT', semester: 3, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'BSCIT-304', name: 'Computer Networks', course: 'BSCIT', semester: 3, type: 'Major', hasPractical: false, credits: 4 },

      // BMS Sem 3 Subjects
      { code: 'BMS-301', name: 'Principles of Marketing', course: 'BMS', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMS-302', name: 'Organizational Behavior', course: 'BMS', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // BAF Sem 3 Subjects
      { code: 'BAF-301', name: 'Cost Accounting', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BAF-302', name: 'Direct Taxation', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },

      // BMM Sem 3 Subjects
      { code: 'BMM-301', name: 'Media Studies', course: 'BMM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMM-302', name: 'Creative Writing', course: 'BMM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 }
    ]);

    // Map subjects for reference
    const subjMap = {};
    subjects.forEach((s) => {
      subjMap[`${s.course}-${s.code}`] = s;
    });

    // 3. Assessment Configuration
    await AssessmentConfig.insertMany([
      { subjectType: 'Major', icaComponentsCount: 3, maxIcaMarks: 25, icaRule: 'BEST_OF_3', maxPracticalMarks: 50, maxFinalExamMarks: 75, passingPercentage: 40 },
      { subjectType: 'Minor', icaComponentsCount: 2, maxIcaMarks: 25, icaRule: 'MEAN_OF_2', maxPracticalMarks: 50, maxFinalExamMarks: 75, passingPercentage: 40 }
    ]);

    // 4. Users (Students and Teachers)
    const facultyUser = await User.create({
      name: 'Dr. Vikram Seth',
      email: 'faculty@college.edu',
      password: 'password123',
      role: 'faculty',
      facultyId: 'FAC-CS-022',
      department: 'Computer Science & Commerce',
      branch: 'Computer Science',
      year: 'Faculty',
      rollNumber: 'FAC-CS-022',
      bio: 'Associate Professor, Business Communication & DBMS'
    });

    const teacher2 = await User.create({
      name: 'Prof. Anita Roy',
      email: 'anita.roy@college.edu',
      password: 'password123',
      role: 'faculty',
      facultyId: 'FAC-COMM-015',
      department: 'Commerce & Accounting',
      branch: 'Commerce',
      year: 'Faculty',
      rollNumber: 'FAC-COMM-015',
      bio: 'Professor of Accounting'
    });

    const adminUser = await User.create({
      name: 'Dean Arthur Pendelton',
      email: 'admin@college.edu',
      password: 'password123',
      role: 'admin',
      adminId: 'ADM-2026-001',
      branch: 'Administration',
      year: 'Admin',
      rollNumber: 'ADM-2026-001',
      bio: 'Chief Campus Administrator'
    });

    const clubAdminUser = await User.create({
      name: 'Sarah Connor',
      email: 'clubadmin@college.edu',
      password: 'password123',
      role: 'club_admin',
      adminId: 'CLB-2026-012',
      branch: 'Information Technology',
      year: '4th Year',
      rollNumber: 'IT2025-012',
      bio: 'Head of Hackathon & Tech Club'
    });

    const placementAdminUser = await User.create({
      name: 'Prof. Richard Davis',
      email: 'placement@college.edu',
      password: 'password123',
      role: 'placement_admin',
      adminId: 'PL-2026-009',
      branch: 'Placement Cell',
      year: 'Faculty',
      rollNumber: 'FAC-PL-009',
      bio: 'Chief Placement Officer'
    });

    // Students for BCOM Sem 3 Div A (5 Students)
    const bcomStudent1 = await User.create({
      name: 'Alex Johnson',
      email: 'student@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BCOM-101',
      course: 'BCOM',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Commerce',
      year: '2nd Year',
      rollNumber: 'BCOM26-A101',
      bio: 'BCOM Sem 3 Div A Student'
    });

    const bcomStudent2 = await User.create({
      name: 'Rohan Mehta',
      email: 'rohan.bcom@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BCOM-102',
      course: 'BCOM',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Commerce',
      year: '2nd Year',
      rollNumber: 'BCOM26-A102'
    });

    const bcomStudent3 = await User.create({
      name: 'Siddharth Rao',
      email: 'siddharth.bcom@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BCOM-103',
      course: 'BCOM',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Commerce',
      year: '2nd Year',
      rollNumber: 'BCOM26-A103'
    });

    const bcomStudent4 = await User.create({
      name: 'Neha Sharma',
      email: 'neha.bcom@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BCOM-104',
      course: 'BCOM',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Commerce',
      year: '2nd Year',
      rollNumber: 'BCOM26-A104'
    });

    const bcomStudent5 = await User.create({
      name: 'Aarav Gupta',
      email: 'aarav.bcom@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BCOM-105',
      course: 'BCOM',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Commerce',
      year: '2nd Year',
      rollNumber: 'BCOM26-A105'
    });

    // Students for BSCIT Sem 3 Div B (5 Students)
    const bscitStudent1 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.bscit@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BSCIT-201',
      course: 'BSCIT',
      semester: 3,
      division: 'B',
      academicYear: '2026-27',
      branch: 'Information Technology',
      year: '2nd Year',
      rollNumber: 'BSCIT26-B201',
      bio: 'BSCIT Sem 3 Div B Student'
    });

    const bscitStudent2 = await User.create({
      name: 'Dev Patel',
      email: 'dev.bscit@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BSCIT-202',
      course: 'BSCIT',
      semester: 3,
      division: 'B',
      academicYear: '2026-27',
      branch: 'Information Technology',
      year: '2nd Year',
      rollNumber: 'BSCIT26-B202'
    });

    const bscitStudent3 = await User.create({
      name: 'Karan Verma',
      email: 'karan.bscit@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BSCIT-203',
      course: 'BSCIT',
      semester: 3,
      division: 'B',
      academicYear: '2026-27',
      branch: 'Information Technology',
      year: '2nd Year',
      rollNumber: 'BSCIT26-B203'
    });

    const bscitStudent4 = await User.create({
      name: 'Riya Singh',
      email: 'riya.bscit@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BSCIT-204',
      course: 'BSCIT',
      semester: 3,
      division: 'B',
      academicYear: '2026-27',
      branch: 'Information Technology',
      year: '2nd Year',
      rollNumber: 'BSCIT26-B204'
    });

    const bscitStudent5 = await User.create({
      name: 'Aditya Joshi',
      email: 'aditya.bscit@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BSCIT-205',
      course: 'BSCIT',
      semester: 3,
      division: 'B',
      academicYear: '2026-27',
      branch: 'Information Technology',
      year: '2nd Year',
      rollNumber: 'BSCIT26-B205'
    });

    // Students for BMS, BAF, BMM
    await User.create({
      name: 'Ananya Roy',
      email: 'ananya.bms@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BMS-301',
      course: 'BMS',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Management',
      year: '2nd Year',
      rollNumber: 'BMS26-A301'
    });

    await User.create({
      name: 'Kabir Verma',
      email: 'kabir.baf@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BAF-401',
      course: 'BAF',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Accounting',
      year: '2nd Year',
      rollNumber: 'BAF26-A401'
    });

    await User.create({
      name: 'Zara Khan',
      email: 'zara.bmm@college.edu',
      password: 'password123',
      role: 'student',
      studentId: 'STU-BMM-501',
      course: 'BMM',
      semester: 3,
      division: 'A',
      academicYear: '2026-27',
      branch: 'Mass Media',
      year: '2nd Year',
      rollNumber: 'BMM26-A501'
    });


    // 5. CRITICAL TEACHING ASSIGNMENTS (Teacher FAC-CS-022 Dr. Vikram Seth)
    // Assignment 1: BCOM Sem 3 Div A -> Business Communication
    const ta1 = await TeachingAssignment.create({
      teachingAssignmentId: 'TA-001',
      teacher: facultyUser._id,
      teacherIdCode: facultyUser.facultyId,
      teacherName: facultyUser.name,
      course: 'BCOM',
      semester: 3,
      division: 'A',
      subject: subjMap['BCOM-BCOM-301']._id,
      subjectName: 'Business Communication',
      subjectCode: 'BCOM-301',
      subjectType: 'Major',
      hasPractical: false,
      academicYear: '2026-27',
      status: 'active'
    });

    // Assignment 2: BSCIT Sem 3 Div B -> Business Communication
    const ta2 = await TeachingAssignment.create({
      teachingAssignmentId: 'TA-002',
      teacher: facultyUser._id,
      teacherIdCode: facultyUser.facultyId,
      teacherName: facultyUser.name,
      course: 'BSCIT',
      semester: 3,
      division: 'B',
      subject: subjMap['BSCIT-BSCIT-301']._id,
      subjectName: 'Business Communication',
      subjectCode: 'BSCIT-301',
      subjectType: 'Minor',
      hasPractical: false,
      academicYear: '2026-27',
      status: 'active'
    });

    // Assignment 3: BSCIT Sem 3 Div B -> Database Management Systems
    const ta3 = await TeachingAssignment.create({
      teachingAssignmentId: 'TA-003',
      teacher: facultyUser._id,
      teacherIdCode: facultyUser.facultyId,
      teacherName: facultyUser.name,
      course: 'BSCIT',
      semester: 3,
      division: 'B',
      subject: subjMap['BSCIT-BSCIT-302']._id,
      subjectName: 'Database Management Systems',
      subjectCode: 'BSCIT-302',
      subjectType: 'Major',
      hasPractical: true,
      academicYear: '2026-27',
      status: 'active'
    });

    // Assignment 4: BCOM Sem 3 Div A -> Corporate Accounting (Prof. Anita Roy)
    const ta4 = await TeachingAssignment.create({
      teachingAssignmentId: 'TA-004',
      teacher: teacher2._id,
      teacherIdCode: teacher2.facultyId,
      teacherName: teacher2.name,
      course: 'BCOM',
      semester: 3,
      division: 'A',
      subject: subjMap['BCOM-BCOM-302']._id,
      subjectName: 'Corporate Accounting',
      subjectCode: 'BCOM-302',
      subjectType: 'Major',
      hasPractical: false,
      academicYear: '2026-27',
      status: 'active'
    });

    // 6. Seed Marks for TA-001 (BCOM Sem 3 Div A - Business Communication - Major: Best of 3 ICAs)
    const bcomStudents = [bcomStudent1, bcomStudent2, bcomStudent3, bcomStudent4, bcomStudent5];
    const bcomMarksData = [
      { ica1: 18, ica2: 21, ica3: 16, finalExam: 62 },
      { ica1: 22, ica2: 19, ica3: 24, finalExam: 68 },
      { ica1: 15, ica2: 17, ica3: 20, finalExam: 55 },
      { ica1: 24, ica2: 25, ica3: 23, finalExam: 71 },
      { ica1: 19, ica2: 18, ica3: 22, finalExam: 60 }
    ];

    for (let i = 0; i < bcomStudents.length; i++) {
      await StudentMarks.create({
        student: bcomStudents[i]._id,
        studentIdCode: bcomStudents[i].studentId,
        studentName: bcomStudents[i].name,
        teachingAssignment: ta1._id,
        course: 'BCOM',
        semester: 3,
        division: 'A',
        subject: subjMap['BCOM-BCOM-301']._id,
        teacher: facultyUser._id,
        academicYear: '2026-27',
        ...bcomMarksData[i]
      });
    }

    // 7. Seed Marks for TA-002 (BSCIT Sem 3 Div B - Business Communication - Minor: Mean of 2 ICAs)
    const bscitStudents = [bscitStudent1, bscitStudent2, bscitStudent3, bscitStudent4, bscitStudent5];
    const bscitMarksData = [
      { ica1: 18, ica2: 22, finalExam: 58 },
      { ica1: 20, ica2: 24, finalExam: 64 },
      { ica1: 16, ica2: 18, finalExam: 52 },
      { ica1: 23, ica2: 25, finalExam: 72 },
      { ica1: 19, ica2: 21, finalExam: 61 }
    ];

    for (let i = 0; i < bscitStudents.length; i++) {
      await StudentMarks.create({
        student: bscitStudents[i]._id,
        studentIdCode: bscitStudents[i].studentId,
        studentName: bscitStudents[i].name,
        teachingAssignment: ta2._id,
        course: 'BSCIT',
        semester: 3,
        division: 'B',
        subject: subjMap['BSCIT-BSCIT-301']._id,
        teacher: facultyUser._id,
        academicYear: '2026-27',
        ...bscitMarksData[i]
      });
    }

    // Seed Marks for TA-003 (BSCIT Sem 3 Div B - DBMS - Major + Practical)
    for (let i = 0; i < bscitStudents.length; i++) {
      await StudentMarks.create({
        student: bscitStudents[i]._id,
        studentIdCode: bscitStudents[i].studentId,
        studentName: bscitStudents[i].name,
        teachingAssignment: ta3._id,
        course: 'BSCIT',
        semester: 3,
        division: 'B',
        subject: subjMap['BSCIT-BSCIT-302']._id,
        teacher: facultyUser._id,
        academicYear: '2026-27',
        ica1: 20 + i,
        ica2: 22 + i,
        ica3: 21 + i,
        practical: 40 + i * 2,
        finalExam: 60 + i * 2
      });
    }

    // Calculate initial class results
    await recalculateClassResults('BCOM', 3, 'A', '2026-27');
    await recalculateClassResults('BSCIT', 3, 'B', '2026-27');

    // 8. Seed V2 Notices, Resources, CampusGuide, Clubs, Placements, etc.
    await Notice.insertMany([
      {
        title: 'V3 Semester Examination & Assessment Timetable Released',
        content: 'End-semester final examinations for BCOM, BSCIT, BMS, BAF, and BMM starting Oct 10, 2026.',
        category: 'academic',
        authorName: 'Dr. Vikram Seth',
        authorRole: 'Faculty',
        authorId: facultyUser._id,
        isImportant: true,
        targetAudience: 'All V3 Undergraduates'
      }
    ]);

    await Resource.insertMany([
      {
        title: 'Business Communication Lecture Series & Case Studies',
        subject: 'Business Communication',
        semester: '3rd Semester',
        branch: 'Commerce & IT',
        category: 'Lecture Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'business_comm_notes.pdf',
        fileSize: '3.5 MB',
        uploadedByName: 'Dr. Vikram Seth',
        downloadsCount: 210
      }
    ]);

    console.log('[Seed] V3 Database successfully seeded with isolated TeachingAssignments, Students, Marks, and Results!');
  } catch (error) {
    console.error('[Seed] Error seeding V3 database:', error);
  }
};
