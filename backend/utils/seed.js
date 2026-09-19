import mongoose from 'mongoose';
import User from '../models/User.js';
import Notice from '../models/Notice.js';
import { Timetable, Syllabus, Assignment, ExamSchedule, Result } from '../models/Academic.js';
import Resource from '../models/Resource.js';
import CampusGuide from '../models/CampusGuide.js';
import Club from '../models/Club.js';
import { PlacementDrive, PlacementResource } from '../models/Placement.js';
import ServiceRequest from '../models/ServiceRequest.js';
import FacultyRequest from '../models/FacultyRequest.js';
import Task from '../models/Task.js';

// V3/V4 Models
import Course from '../models/Course.js';
import Subject from '../models/Subject.js';
import TeachingAssignment from '../models/TeachingAssignment.js';
import AssessmentConfig from '../models/AssessmentConfig.js';
import StudentMarks from '../models/StudentMarks.js';
import V3Result from '../models/V3Result.js';
import Attendance from '../models/Attendance.js';
import Notification from '../models/Notification.js';
import { calculateSubjectPerformance, recalculateClassResults } from '../controllers/academicCoreController.js';

const firstNames = [
  'Alex', 'Rohan', 'Siddharth', 'Neha', 'Aarav', 'Priya', 'Dev', 'Karan', 'Riya', 'Aditya',
  'Ananya', 'Kabir', 'Zara', 'Rahul', 'Sneha', 'Vikram', 'Tanvi', 'Arjun', 'Isha', 'Varun',
  'Meera', 'Yash', 'Pooja', 'Kunal', 'Divya', 'Manish', 'Kavya', 'Gaurav', 'Nisha', 'Aman',
  'Simran', 'Sahil', 'Deepak', 'Tarun', 'Shreya', 'Abhishek', 'Ritika', 'Harsh', 'Preeti', 'Karthik'
];

const lastNames = [
  'Johnson', 'Mehta', 'Rao', 'Sharma', 'Gupta', 'Patel', 'Verma', 'Singh', 'Joshi', 'Roy',
  'Deshmukh', 'Khan', 'Kulkarni', 'Shah', 'Nair', 'Chopra', 'Malhotra', 'Bhat', 'Dutta', 'Iyengar',
  'Reddy', 'Pillai', 'Saxena', 'Kapoor', 'Trivedi', 'Wagh', 'Shetty', 'Agarwal', 'Menon', 'Jain'
];

export const seedDatabase = async () => {
  try {
    const studentCount = await User.countDocuments({ role: 'student' });
    if (studentCount >= 1300) {
      console.log('[Seed] Database already fully seeded with 1,380+ students. Skipping.');
      return;
    }

    console.log('[Seed] Clearing existing collections for clean Master Seeding...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Subject.deleteMany({});
    await TeachingAssignment.deleteMany({});
    await AssessmentConfig.deleteMany({});
    await StudentMarks.deleteMany({});
    await V3Result.deleteMany({});
    await Attendance.deleteMany({});
    await Notice.deleteMany({});
    await Resource.deleteMany({});
    await CampusGuide.deleteMany({});
    await Club.deleteMany({});
    await PlacementDrive.deleteMany({});
    await ServiceRequest.deleteMany({});
    await FacultyRequest.deleteMany({});
    await Task.deleteMany({});
    await Timetable.deleteMany({});
    await Syllabus.deleteMany({});
    await Assignment.deleteMany({});
    await ExamSchedule.deleteMany({});
    await Result.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Seeding CampusOne Master Data across UG & PG Programs...');

    // 1. Courses (5 UG + 4 PG Courses)
    const courses = await Course.insertMany([
      // UG Programs (3 Years, 6 Semesters)
      { code: 'BCOM', name: 'Bachelor of Commerce', academicLevel: 'UG', description: 'Commerce, Accounting & Business Finance', durationYears: 3, totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BSCIT', name: 'B.Sc. Information Technology', academicLevel: 'UG', description: 'Software Engineering, DBMS & Networks', durationYears: 3, totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BMS', name: 'Bachelor of Management Studies', academicLevel: 'UG', description: 'Business Management & Leadership', durationYears: 3, totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BAF', name: 'Bachelor of Accounting and Finance', academicLevel: 'UG', description: 'Financial Analysis & Auditing', durationYears: 3, totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BMM', name: 'Bachelor of Mass Media', academicLevel: 'UG', description: 'Journalism, Advertising & Public Relations', durationYears: 3, totalSemesters: 6, divisions: ['A', 'B'] },
      
      // PG Programs (2 Years, 4 Semesters)
      { code: 'MCA', name: 'Master of Computer Applications', academicLevel: 'PG', description: 'Advanced Software Engineering, AI & Cloud Computing', durationYears: 2, totalSemesters: 4, divisions: ['A', 'B'] },
      { code: 'MBA', name: 'Master of Business Administration', academicLevel: 'PG', description: 'Strategic Management, Finance & Analytics', durationYears: 2, totalSemesters: 4, divisions: ['A', 'B'] },
      { code: 'MSCIT', name: 'M.Sc. Information Technology', academicLevel: 'PG', description: 'Advanced Data Science & Cyber Security', durationYears: 2, totalSemesters: 4, divisions: ['A', 'B'] },
      { code: 'MCOM', name: 'Master of Commerce', academicLevel: 'PG', description: 'Advanced Accounting, Taxation & Research', durationYears: 2, totalSemesters: 4, divisions: ['A', 'B'] }
    ]);

    // 2. Course-Specific Subjects across semesters
    const subjectsData = [
      // BCOM
      { code: 'BCOM-301', name: 'Business Communication', course: 'BCOM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BCOM-302', name: 'Corporate Accounting', course: 'BCOM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BCOM-303', name: 'Business Economics III', course: 'BCOM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },
      { code: 'BCOM-304', name: 'Commercial Law', course: 'BCOM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // BSCIT
      { code: 'BSCIT-301', name: 'Business Communication', course: 'BSCIT', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },
      { code: 'BSCIT-302', name: 'Database Management Systems', course: 'BSCIT', semester: 3, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'BSCIT-303', name: 'Python Programming', course: 'BSCIT', semester: 3, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'BSCIT-304', name: 'Computer Networks', course: 'BSCIT', semester: 3, type: 'Major', hasPractical: false, credits: 4 },

      // BMS
      { code: 'BMS-301', name: 'Principles of Marketing', course: 'BMS', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMS-302', name: 'Organizational Behavior', course: 'BMS', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },
      { code: 'BMS-303', name: 'Business Statistics', course: 'BMS', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMS-304', name: 'Financial Management', course: 'BMS', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // BAF
      { code: 'BAF-301', name: 'Cost Accounting', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BAF-302', name: 'Direct Taxation', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BAF-303', name: 'Financial Accounting III', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BAF-304', name: 'Business Law II', course: 'BAF', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // BMM
      { code: 'BMM-301', name: 'Media Studies', course: 'BMM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMM-302', name: 'Creative Writing', course: 'BMM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },
      { code: 'BMM-303', name: 'Public Relations', course: 'BMM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMM-304', name: 'Mass Communication', course: 'BMM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // MCA (PG Year 1 & 2)
      { code: 'MCA-101', name: 'Advanced Java & Distributed Systems', course: 'MCA', semester: 1, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'MCA-102', name: 'Advanced Database Systems & NoSQL', course: 'MCA', semester: 1, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'MCA-103', name: 'Software Architecture & Cloud Computing', course: 'MCA', semester: 1, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'MCA-104', name: 'AI & Machine Learning Foundations', course: 'MCA', semester: 1, type: 'Minor', hasPractical: true, credits: 3 },

      // MBA (PG Year 1 & 2)
      { code: 'MBA-101', name: 'Managerial Economics & Strategy', course: 'MBA', semester: 1, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'MBA-102', name: 'Corporate Finance & Valuation', course: 'MBA', semester: 1, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'MBA-103', name: 'Strategic Marketing Management', course: 'MBA', semester: 1, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'MBA-104', name: 'Business Analytics & Decision Science', course: 'MBA', semester: 1, type: 'Minor', hasPractical: true, credits: 3 },

      // MSCIT (PG Year 1 & 2)
      { code: 'MSCIT-101', name: 'Data Science & Big Analytics', course: 'MSCIT', semester: 1, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'MSCIT-102', name: 'Cyber Security & Cryptography', course: 'MSCIT', semester: 1, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'MSCIT-103', name: 'Advanced Networking & Wireless Tech', course: 'MSCIT', semester: 1, type: 'Major', hasPractical: true, credits: 4 },
      { code: 'MSCIT-104', name: 'Research Methodology & Ethics', course: 'MSCIT', semester: 1, type: 'Minor', hasPractical: false, credits: 3 },

      // MCOM (PG Year 1 & 2)
      { code: 'MCOM-101', name: 'Advanced Cost & Management Accounting', course: 'MCOM', semester: 1, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'MCOM-102', name: 'Corporate Tax Planning & GST', course: 'MCOM', semester: 1, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'MCOM-103', name: 'International Finance & Trade', course: 'MCOM', semester: 1, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'MCOM-104', name: 'Research Methodology in Business', course: 'MCOM', semester: 1, type: 'Minor', hasPractical: false, credits: 3 }
    ];

    const subjects = await Subject.insertMany(subjectsData);
    const subjMap = {};
    subjects.forEach((s) => {
      subjMap[`${s.course}-${s.code}`] = s;
    });

    // 3. Assessment Configuration
    await AssessmentConfig.insertMany([
      { subjectType: 'Major', icaComponentsCount: 3, maxIcaMarks: 25, icaRule: 'BEST_OF_3', maxPracticalMarks: 50, maxFinalExamMarks: 75, passingPercentage: 40 },
      { subjectType: 'Minor', icaComponentsCount: 2, maxIcaMarks: 25, icaRule: 'MEAN_OF_2', maxPracticalMarks: 50, maxFinalExamMarks: 75, passingPercentage: 40 }
    ]);

    // 4. Core Demo Accounts for All 5 Roles
    // Pre-hash default password for fast bulk seeding
    const bcrypt = (await import('bcryptjs')).default;
    const defaultHashedPassword = await bcrypt.hash('password123', 10);

    const facultyUser = await User.create({
      name: 'Dr. Vikram Seth',
      email: 'faculty@college.edu',
      password: 'password123',
      role: 'faculty',
      facultyId: 'FAC-2026-001',
      department: 'Computer Science & Commerce',
      branch: 'Computer Science',
      year: 'Faculty',
      rollNumber: 'FAC-CS-022',
      bio: 'Associate Professor, Business Communication & DBMS'
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
      bio: 'Head of Rotaract & Cultural Clubs'
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

    // Seed ~35 Faculty Members across departments
    const facultyList = [facultyUser, placementAdminUser];
    const departments = [
      'Commerce', 'Information Technology', 'Management Studies', 'Accounting & Finance',
      'Mass Media', 'Computer Applications', 'Business Administration', 'Data Science'
    ];

    let facCounter = 3;
    const facDocs = [];
    for (let f = 1; f <= 33; f++) {
      const fn = firstNames[(facCounter * 3) % firstNames.length];
      const ln = lastNames[(facCounter * 5) % lastNames.length];
      const dept = departments[f % departments.length];
      const fId = `FAC-${dept.substring(0, 3).toUpperCase()}-${String(f).padStart(3, '0')}`;
      facDocs.push({
        name: `Prof. ${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@college.edu`,
        password: defaultHashedPassword,
        role: 'faculty',
        facultyId: fId,
        department: dept,
        branch: dept,
        year: 'Faculty',
        rollNumber: fId,
        bio: `Faculty Member in ${dept}`
      });
      facCounter++;
    }
    const createdFacs = await User.insertMany(facDocs);
    facultyList.push(...createdFacs);
    console.log(`[Seed] Created ${facultyList.length} faculty members.`);

    // 5. Seed ~1,380 Students across UG and PG Programs
    // UG: 5 courses * 3 year levels (FY, SY, TY) * 2 divisions (A, B) = 30 divisions * 30 students = 900 students
    // PG: 4 courses * 2 year levels (Year 1, Year 2) * 2 divisions (A, B) = 16 divisions * 30 students = 480 students
    // Total = 1,380 students
    const ugPrograms = [
      { code: 'BCOM', levels: [{ yearLevel: 'FY', sem: 1 }, { yearLevel: 'SY', sem: 3 }, { yearLevel: 'TY', sem: 5 }] },
      { code: 'BSCIT', levels: [{ yearLevel: 'FY', sem: 1 }, { yearLevel: 'SY', sem: 3 }, { yearLevel: 'TY', sem: 5 }] },
      { code: 'BMS', levels: [{ yearLevel: 'FY', sem: 1 }, { yearLevel: 'SY', sem: 3 }, { yearLevel: 'TY', sem: 5 }] },
      { code: 'BAF', levels: [{ yearLevel: 'FY', sem: 1 }, { yearLevel: 'SY', sem: 3 }, { yearLevel: 'TY', sem: 5 }] },
      { code: 'BMM', levels: [{ yearLevel: 'FY', sem: 1 }, { yearLevel: 'SY', sem: 3 }, { yearLevel: 'TY', sem: 5 }] }
    ];

    const pgPrograms = [
      { code: 'MCA', levels: [{ yearLevel: 'Year 1', sem: 1 }, { yearLevel: 'Year 2', sem: 3 }] },
      { code: 'MBA', levels: [{ yearLevel: 'Year 1', sem: 1 }, { yearLevel: 'Year 2', sem: 3 }] },
      { code: 'MSCIT', levels: [{ yearLevel: 'Year 1', sem: 1 }, { yearLevel: 'Year 2', sem: 3 }] },
      { code: 'MCOM', levels: [{ yearLevel: 'Year 1', sem: 1 }, { yearLevel: 'Year 2', sem: 3 }] }
    ];

    const divisions = ['A', 'B'];
    const allStudentDocs = [];
    let globalStuIdx = 1;

    // Seed UG Students
    for (const prog of ugPrograms) {
      for (const lvl of prog.levels) {
        for (const div of divisions) {
          for (let i = 1; i <= 30; i++) {
            const fn = firstNames[(globalStuIdx * 7) % firstNames.length];
            const ln = lastNames[(globalStuIdx * 11) % lastNames.length];
            const stuIdCode = `${prog.code}-${lvl.yearLevel}-${div}-${String(i).padStart(3, '0')}`;

            let email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${stuIdCode.toLowerCase().replace(/[^a-z0-9]/g, '')}@college.edu`;
            let name = `${fn} ${ln}`;

            // Primary Demo Student Override
            if (prog.code === 'BCOM' && lvl.yearLevel === 'SY' && div === 'A' && i === 1) {
              name = 'Alex Johnson';
              email = 'student@college.edu';
            }

            allStudentDocs.push({
              name,
              email,
              password: defaultHashedPassword,
              role: 'student',
              studentId: prog.code === 'BCOM' && lvl.yearLevel === 'SY' && div === 'A' && i === 1 ? 'STU-2026-101' : stuIdCode,
              course: prog.code,
              semester: lvl.sem,
              division: div,
              academicLevel: 'UG',
              yearLevel: lvl.yearLevel,
              academicYear: '2026-27',
              branch: prog.code,
              year: `${lvl.yearLevel} (${prog.code})`,
              rollNumber: stuIdCode,
              bio: `UG Student - ${prog.code} ${lvl.yearLevel} Div ${div}`
            });
            globalStuIdx++;
          }
        }
      }
    }

    // Seed PG Students
    for (const prog of pgPrograms) {
      for (const lvl of prog.levels) {
        for (const div of divisions) {
          for (let i = 1; i <= 30; i++) {
            const fn = firstNames[(globalStuIdx * 13) % firstNames.length];
            const ln = lastNames[(globalStuIdx * 17) % lastNames.length];
            const stuIdCode = `${prog.code}-PG${lvl.sem}-${div}-${String(i).padStart(3, '0')}`;
            const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${stuIdCode.toLowerCase().replace(/[^a-z0-9]/g, '')}@college.edu`;

            allStudentDocs.push({
              name: `${fn} ${ln}`,
              email,
              password: defaultHashedPassword,
              role: 'student',
              studentId: stuIdCode,
              course: prog.code,
              semester: lvl.sem,
              division: div,
              academicLevel: 'PG',
              yearLevel: lvl.yearLevel,
              academicYear: '2026-27',
              branch: prog.code,
              year: `${lvl.yearLevel} (${prog.code})`,
              rollNumber: stuIdCode,
              bio: `Masters Student - ${prog.code} ${lvl.yearLevel} Div ${div}`
            });
            globalStuIdx++;
          }
        }
      }
    }

    const allStudents = await User.insertMany(allStudentDocs);
    console.log(`[Seed] Created ${allStudents.length} students across UG & PG programs (~1,380 total).`);

    // 6. Teaching Assignments
    // Key explicit assignment: Dr. Vikram Seth teaches Business Communication (BCOM Sem 3 Div A) AND Business Communication (BSCIT Sem 3 Div B)
    const taBcomA = await TeachingAssignment.create({
      teachingAssignmentId: 'TA-BCOM-A-301',
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

    const taBscitB = await TeachingAssignment.create({
      teachingAssignmentId: 'TA-BSCIT-B-301',
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

    const taDbms = await TeachingAssignment.create({
      teachingAssignmentId: 'TA-BSCIT-B-302',
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

    const allAssignments = [taBcomA, taBscitB, taDbms];
    let facIdx = 1;

    // Generate assignments for all subjects across all courses & divisions
    for (const subj of subjects) {
      for (const div of divisions) {
        // Skip if already created
        if (subj.course === 'BCOM' && div === 'A' && subj.code === 'BCOM-301') continue;
        if (subj.course === 'BSCIT' && div === 'B' && (subj.code === 'BSCIT-301' || subj.code === 'BSCIT-302')) continue;

        const assignedFac = facultyList[facIdx % facultyList.length];
        facIdx++;

        const ta = await TeachingAssignment.create({
          teachingAssignmentId: `TA-${subj.course}-${div}-${subj.code}`,
          teacher: assignedFac._id,
          teacherIdCode: assignedFac.facultyId || `FAC-${assignedFac._id.toString().slice(-4)}`,
          teacherName: assignedFac.name,
          course: subj.course,
          semester: subj.semester,
          division: div,
          subject: subj._id,
          subjectName: subj.name,
          subjectCode: subj.code,
          subjectType: subj.type,
          hasPractical: subj.hasPractical,
          academicYear: '2026-27',
          status: 'active'
        });
        allAssignments.push(ta);
      }
    }
    console.log(`[Seed] Created ${allAssignments.length} isolated teaching assignments.`);

    // 7. Seed Student Marks with 3 ICAs for Major & 2 ICAs for Minor
    const marksDocs = [];
    for (const ta of allAssignments) {
      const classStudents = allStudents.filter(
        (s) => s.course === ta.course && s.semester === ta.semester && s.division === ta.division
      );

      for (let i = 0; i < classStudents.length; i++) {
        const st = classStudents[i];
        const base = 16 + ((i * 3 + ta.subjectCode.charCodeAt(0)) % 8);

        const ica1 = Math.min(25, base + (i % 3));
        const ica2 = Math.min(25, base + 3 - (i % 2));
        const ica3 = ta.subjectType === 'Major' ? Math.min(25, base + 2) : null;
        const practical = ta.hasPractical ? Math.min(50, 36 + (i % 12)) : null;
        const finalExam = Math.min(75, 52 + (i % 20));

        marksDocs.push({
          student: st._id,
          studentIdCode: st.studentId,
          studentName: st.name,
          teachingAssignment: ta._id,
          course: ta.course,
          semester: ta.semester,
          division: ta.division,
          subject: ta.subject,
          teacher: ta.teacher,
          academicYear: '2026-27',
          ica1,
          ica2,
          ica3,
          practical,
          finalExam
        });
      }
    }

    await StudentMarks.insertMany(marksDocs);
    console.log(`[Seed] Created ${marksDocs.length} StudentMarks records.`);

    // 8. Recalculate Results using Major 3-ICA best-two & Minor 2-ICA average rules
    for (const courseItem of courses) {
      const sems = courseItem.academicLevel === 'UG' ? [1, 3, 5] : [1, 3];
      for (const sem of sems) {
        for (const div of divisions) {
          await recalculateClassResults(courseItem.code, sem, div, '2026-27');
        }
      }
    }
    console.log('[Seed] Recalculated Semester V3Results for all classes.');

    // 9. Seed Historical Results for Previous Semesters
    const demoStudent = allStudents.find(s => s.email === 'student@college.edu');
    if (demoStudent) {
      await V3Result.create({
        student: demoStudent._id,
        studentIdCode: demoStudent.studentId,
        studentName: demoStudent.name,
        course: demoStudent.course,
        semester: 1,
        division: demoStudent.division,
        academicYear: '2025-26',
        subjectResults: [
          { subjectCode: 'BCOM-101', subjectName: 'Financial Accounting I', totalMarksObtained: 82, totalMaxMarks: 100, percentage: 82, grade: 'O', status: 'Pass' },
          { subjectCode: 'BCOM-102', subjectName: 'Business Mathematics', totalMarksObtained: 76, totalMaxMarks: 100, percentage: 76, grade: 'A+', status: 'Pass' },
          { subjectCode: 'BCOM-103', subjectName: 'Business Economics I', totalMarksObtained: 80, totalMaxMarks: 100, percentage: 80, grade: 'O', status: 'Pass' }
        ],
        totalObtained: 238,
        totalMax: 300,
        overallPercentage: 79.3,
        sgpa: 7.93,
        overallGrade: 'A+',
        overallStatus: 'Pass'
      });

      await V3Result.create({
        student: demoStudent._id,
        studentIdCode: demoStudent.studentId,
        studentName: demoStudent.name,
        course: demoStudent.course,
        semester: 2,
        division: demoStudent.division,
        academicYear: '2025-26',
        subjectResults: [
          { subjectCode: 'BCOM-201', subjectName: 'Financial Accounting II', totalMarksObtained: 85, totalMaxMarks: 100, percentage: 85, grade: 'O', status: 'Pass' },
          { subjectCode: 'BCOM-202', subjectName: 'Environmental Studies', totalMarksObtained: 88, totalMaxMarks: 100, percentage: 88, grade: 'O', status: 'Pass' },
          { subjectCode: 'BCOM-203', subjectName: 'Business Economics II', totalMarksObtained: 79, totalMaxMarks: 100, percentage: 79, grade: 'A+', status: 'Pass' }
        ],
        totalObtained: 252,
        totalMax: 300,
        overallPercentage: 84.0,
        sgpa: 8.4,
        overallGrade: 'O',
        overallStatus: 'Pass'
      });
    }

    // 10. Seed Attendance Records
    const attendanceDates = [
      new Date('2026-08-01'), new Date('2026-08-05'), new Date('2026-08-10'),
      new Date('2026-08-15'), new Date('2026-08-20'), new Date('2026-08-25'),
      new Date('2026-09-01'), new Date('2026-09-05'), new Date('2026-09-10'),
      new Date('2026-09-15')
    ];

    const attDocs = [];
    for (const ta of allAssignments.slice(0, 20)) {
      const classStudents = allStudents.filter(s => s.course === ta.course && s.semester === ta.semester && s.division === ta.division);
      for (const d of attendanceDates) {
        for (let i = 0; i < classStudents.length; i++) {
          const st = classStudents[i];
          const isPresent = (i + d.getDate()) % 6 !== 0;
          attDocs.push({
            student: st._id,
            studentIdCode: st.studentId,
            studentName: st.name,
            teachingAssignment: ta._id,
            course: ta.course,
            semester: ta.semester,
            division: ta.division,
            subject: ta.subject,
            subjectCode: ta.subjectCode,
            subjectName: ta.subjectName,
            teacher: ta.teacher,
            academicYear: '2026-27',
            date: d,
            status: isPresent ? 'Present' : 'Absent'
          });
        }
      }
    }
    await Attendance.insertMany(attDocs);
    console.log(`[Seed] Created ${attDocs.length} Attendance records.`);

    // 11. Timetables (Seeded across all valid semesters for UG & PG)
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    for (const courseItem of courses) {
      const maxSem = courseItem.academicLevel === 'UG' ? 6 : 4;
      for (let sem = 1; sem <= maxSem; sem++) {
        for (const div of divisions) {
          await Timetable.create({
            branch: `${courseItem.code}-${div}`,
            semester: String(sem),
            schedule: daysOfWeek.map((day, dIdx) => ({
              day,
              slots: [
                {
                  time: '08:00 AM - 09:00 AM',
                  subject: `${courseItem.code} Core Subject I (Module ${dIdx + 1})`,
                  code: `${courseItem.code}-${sem}01`,
                  instructor: 'Dr. Vikram Seth',
                  room: `Room ${100 + sem * 10 + dIdx + 1}`
                },
                {
                  time: '09:00 AM - 10:00 AM',
                  subject: `${courseItem.code} Core Subject II / Practical Lab`,
                  code: `${courseItem.code}-${sem}02`,
                  instructor: 'Prof. Anita Roy',
                  room: `Lab ${dIdx + 1}`
                },
                {
                  time: '10:30 AM - 11:30 AM',
                  subject: `${courseItem.code} Specialized Advanced Subject`,
                  code: `${courseItem.code}-${sem}03`,
                  instructor: 'Prof. Rajesh Sharma',
                  room: `Room ${100 + sem * 10 + dIdx + 2}`
                },
                {
                  time: '11:30 AM - 12:30 PM',
                  subject: `${courseItem.code} Elective & Seminar Session`,
                  code: `${courseItem.code}-${sem}04`,
                  instructor: 'Prof. Meera Nair',
                  room: `Hall ${div}`
                }
              ]
            }))
          });
        }
      }
    }

    // 12. Syllabi & Exam Schedules
    for (const s of subjects.slice(0, 10)) {
      await Syllabus.create({
        subject: s.name,
        code: s.code,
        branch: s.course,
        semester: String(s.semester),
        credits: s.credits,
        modules: [
          { title: 'Module 1: Fundamental Concepts & Frameworks', topics: ['Introduction & History', 'Core Theoretical Principles', 'Case Studies'] },
          { title: 'Module 2: Advanced Operations & Applications', topics: ['Practical Implementation', 'Industry Standards', 'Problem Solving Methods'] }
        ]
      });
    }

    await ExamSchedule.create({
      title: 'End-Semester Final Examinations October 2026',
      branch: 'College-Wide',
      semester: '3',
      exams: [
        { subject: 'Business Communication', code: 'BCOM-301 / BSCIT-301', date: new Date('2026-10-10'), time: '10:00 AM - 01:00 PM', hall: 'Main Hall A' },
        { subject: 'Database Management Systems', code: 'BSCIT-302', date: new Date('2026-10-12'), time: '10:00 AM - 01:00 PM', hall: 'Computer Lab 1' },
        { subject: 'Corporate Accounting', code: 'BCOM-302', date: new Date('2026-10-14'), time: '10:00 AM - 01:00 PM', hall: 'Hall B' }
      ]
    });

    // 13. Assignments
    if (demoStudent) {
      await Assignment.create({
        title: 'Business Communication Case Analysis & Oral Report',
        subject: 'Business Communication',
        branch: 'BCOM',
        year: '2nd Year',
        dueDate: new Date('2026-09-30'),
        maxMarks: 100,
        description: 'Analyze corporate communication breakdowns in Fortune 500 mergers and submit a formal report.',
        submissions: [
          {
            studentId: demoStudent._id,
            studentName: demoStudent.name,
            submittedAt: new Date('2026-09-15'),
            fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            fileName: 'alex_johnson_case_study.pdf',
            status: 'Submitted'
          }
        ]
      });
    }

    // 14. Resources
    await Resource.insertMany([
      {
        title: 'Business Communication Lecture Notes & Case Studies',
        subject: 'Business Communication',
        semester: '3rd Semester',
        branch: 'Commerce & IT',
        category: 'Lecture Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'business_comm_notes.pdf',
        fileSize: '3.5 MB',
        uploadedByName: 'Dr. Vikram Seth',
        downloadsCount: 340
      },
      {
        title: 'DBMS SQL & Relational Algebra Problem Sets',
        subject: 'Database Management Systems',
        semester: '3rd Semester',
        branch: 'Information Technology',
        category: 'Question Bank',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'dbms_sql_problems.pdf',
        fileSize: '2.1 MB',
        uploadedByName: 'Dr. Vikram Seth',
        downloadsCount: 420
      },
      {
        title: 'Corporate Accounting Solved Past Papers (2022-2025)',
        subject: 'Corporate Accounting',
        semester: '3rd Semester',
        branch: 'Commerce',
        category: 'PYQs',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'corporate_accounting_past_papers.pdf',
        fileSize: '4.8 MB',
        uploadedByName: 'Prof. Anita Roy',
        downloadsCount: 510
      }
    ]);

    // 15. Campus Guide Locations
    await CampusGuide.insertMany([
      { name: 'Central Library', category: 'library', location: 'Main Academic Block', building: 'Block A', floor: '2nd Floor', roomNumber: '201', timings: '08:00 AM - 08:00 PM', description: 'Access over 50,000 reference books, digital archives, and quiet study pods.' },
      { name: 'Advanced Computer Lab 1', category: 'lab', location: 'IT Wing', building: 'Block B', floor: '1st Floor', roomNumber: '104', timings: '08:30 AM - 05:30 PM', description: 'High-performance computing laboratory equipped with 60 workstations and high-speed fiber internet.' },
      { name: 'Science & Electronics Lab', category: 'lab', location: 'Science Wing', building: 'Block C', floor: 'Ground Floor', roomNumber: '002', timings: '09:00 AM - 05:00 PM', description: 'State-of-the-art physics, chemistry, and electronics testing equipment.' },
      { name: 'Main Auditorium', category: 'admin', location: 'Campus Grounds', building: 'Auditorium Complex', floor: 'Ground Floor', roomNumber: 'AUD-1', timings: 'Event Based', description: 'Air-conditioned 1,200 seat theater with 4K projection and acoustic sound system.' },
      { name: 'Student Canteen', category: 'canteen', location: 'Student Plaza', building: 'Plaza Center', floor: 'Ground Floor', roomNumber: 'CN-1', timings: '07:30 AM - 07:00 PM', description: 'Hygienic multi-cuisine cafeteria providing fresh meals, beverages, and snacks.' },
      { name: 'Administration Office', category: 'admin', location: 'Main Administrative Building', building: 'Block A', floor: 'Ground Floor', roomNumber: '101', timings: '09:30 AM - 04:30 PM', description: 'College registrar, fee collection counters, and general inquiries.' },
      { name: 'Examination Cell', category: 'admin', location: 'Administrative Block', building: 'Block A', floor: '1st Floor', roomNumber: '112', timings: '10:00 AM - 04:00 PM', description: 'Official hall ticket issuance, grade transcript verification, and re-evaluation applications.' },
      { name: 'Placement Cell', category: 'admin', location: 'Placement Building', building: 'Block D', floor: '3rd Floor', roomNumber: '305', timings: '09:00 AM - 05:00 PM', description: 'Corporate recruitment desk, interview rooms, and career guidance center.' },
      { name: 'Student Help Desk', category: 'admin', location: 'Student Activity Center', building: 'Block B', floor: 'Ground Floor', roomNumber: '010', timings: '09:00 AM - 05:00 PM', description: 'First point of contact for service requests, bonafide certificates, and lost-and-found.' },
      { name: 'Sports Complex & Gymnasium', category: 'sports', location: 'South Campus', building: 'Sports Complex', floor: 'Ground Floor', roomNumber: 'SP-1', timings: '06:00 AM - 07:00 PM', description: 'Indoor basketball court, badminton courts, table tennis, and modern fitness gym.' }
    ]);

    // 16. Clubs (Required: Rotaract, NSS, DLLE + Cultural, Sports, Technical, Literary, E-Cell)
    await Club.insertMany([
      {
        name: 'Rotaract Club of CampusOne',
        category: 'Social Service',
        description: 'Fostering leadership, youth development, and community welfare initiatives.',
        adminName: 'Sarah Connor',
        adminEmail: 'clubadmin@college.edu',
        teacherInCharge: facultyUser._id,
        teacherInChargeName: facultyUser.name,
        teacherInChargeEmail: facultyUser.email,
        membersCount: 140,
        members: allStudents.slice(0, 30).map(s => s._id),
        events: [
          { title: 'Annual Youth Leadership Summit 2026', description: 'Inter-college leadership panel and keynote sessions.', date: new Date('2026-10-05'), venue: 'Main Auditorium' }
        ]
      },
      {
        name: 'NSS (National Service Scheme)',
        category: 'Social Service',
        description: 'Not Me But You — selfless community service and rural outreach programs.',
        adminName: 'Prof. Rajesh Sharma',
        adminEmail: 'nss@college.edu',
        teacherInCharge: facultyList[2]._id,
        teacherInChargeName: facultyList[2].name,
        teacherInChargeEmail: facultyList[2].email,
        membersCount: 210,
        members: allStudents.slice(30, 70).map(s => s._id),
        events: [
          { title: 'Mega Campus Blood Donation Camp', description: 'Annual blood donation drive in association with City Red Cross.', date: new Date('2026-09-28'), venue: 'Student Plaza' }
        ]
      },
      {
        name: 'DLLE (Department of Lifelong Learning & Extension)',
        category: 'Social Service',
        description: 'Promoting community outreach, career guidance, and social survey projects.',
        adminName: 'Prof. Meera Nair',
        adminEmail: 'dlle@college.edu',
        teacherInCharge: facultyList[3]._id,
        teacherInChargeName: facultyList[3].name,
        teacherInChargeEmail: facultyList[3].email,
        membersCount: 110,
        members: allStudents.slice(70, 100).map(s => s._id),
        events: [
          { title: 'DLLE Community Survey Exhibition', description: 'Student presentation of research survey findings.', date: new Date('2026-10-18'), venue: 'Exhibition Hall B' }
        ]
      },
      {
        name: 'Cultural Club & Performing Arts',
        category: 'Cultural',
        description: 'Hub for music, dance, drama, fashion, and inter-college cultural festivals.',
        adminName: 'Prof. Anita Roy',
        adminEmail: 'cultural@college.edu',
        teacherInCharge: facultyList[4]._id,
        teacherInChargeName: facultyList[4].name,
        teacherInChargeEmail: facultyList[4].email,
        membersCount: 180,
        members: allStudents.slice(100, 140).map(s => s._id)
      },
      {
        name: 'Coding & Tech Innovators Club',
        category: 'Technical',
        description: 'Competitive programming, hackathons, open-source software, and AI workshops.',
        adminName: 'Dr. Vikram Seth',
        adminEmail: 'techclub@college.edu',
        teacherInCharge: facultyUser._id,
        teacherInChargeName: facultyUser.name,
        teacherInChargeEmail: facultyUser.email,
        membersCount: 160,
        members: allStudents.slice(140, 180).map(s => s._id)
      },
      {
        name: 'Sports & Athletics Association',
        category: 'Sports',
        description: 'Organizing inter-departmental tournaments in cricket, football, chess, and track events.',
        adminName: 'Prof. Arjun Verma',
        adminEmail: 'sports@college.edu',
        teacherInCharge: facultyList[5]._id,
        teacherInChargeName: facultyList[5].name,
        teacherInChargeEmail: facultyList[5].email,
        membersCount: 220,
        members: allStudents.slice(180, 220).map(s => s._id)
      },
      {
        name: 'Literary & Debating Society',
        category: 'Literary',
        description: 'Model UN, parliamentary debates, creative writing competitions, and book clubs.',
        adminName: 'Prof. Sunita Patil',
        adminEmail: 'literary@college.edu',
        teacherInCharge: facultyList[6]._id,
        teacherInChargeName: facultyList[6].name,
        teacherInChargeEmail: facultyList[6].email,
        membersCount: 95,
        members: allStudents.slice(220, 250).map(s => s._id)
      },
      {
        name: 'E-Cell (Entrepreneurship Cell)',
        category: 'Technical',
        description: 'Empowering student startups with mentorship, pitch competitions, and angel funding connections.',
        adminName: 'Prof. Suresh Kulkarni',
        adminEmail: 'ecell@college.edu',
        teacherInCharge: facultyList[7]._id,
        teacherInChargeName: facultyList[7].name,
        teacherInChargeEmail: facultyList[7].email,
        membersCount: 130,
        members: allStudents.slice(250, 280).map(s => s._id)
      }
    ]);

    // 17. Placement Drives
    await PlacementDrive.insertMany([
      {
        companyName: 'TCS (Tata Consultancy Services)',
        logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
        role: 'Graduate Trainee / Software Engineer',
        ctc: '7.5 LPA',
        eligibleBranches: ['BSCIT', 'BCOM', 'BMS', 'MCA', 'MSCIT'],
        driveDate: new Date('2026-10-15'),
        deadlineDate: new Date('2026-10-05'),
        location: 'Mumbai / Pune',
        description: 'Campus placement drive for software development, cloud infrastructure, and business analytics roles.',
        status: 'active',
        applicants: [
          { studentId: demoStudent._id, studentName: demoStudent.name, cgpa: 8.4, appliedAt: new Date(), status: 'Applied' }
        ]
      },
      {
        companyName: 'Deloitte India',
        logoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80',
        role: 'Associate Risk & Financial Analyst',
        ctc: '8.2 LPA',
        eligibleBranches: ['BAF', 'BCOM', 'BMS', 'MBA', 'MCOM'],
        driveDate: new Date('2026-10-22'),
        deadlineDate: new Date('2026-10-12'),
        location: 'Mumbai / Bengaluru',
        description: 'Financial auditing, tax advisory, and risk assessment consultant positions.',
        status: 'active'
      },
      {
        companyName: 'HDFC Bank',
        logoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=120&auto=format&fit=crop&q=80',
        role: 'Management Trainee - Retail Banking',
        ctc: '6.8 LPA',
        eligibleBranches: ['BMS', 'BAF', 'BCOM', 'MBA', 'MCOM'],
        driveDate: new Date('2026-11-02'),
        deadlineDate: new Date('2026-10-25'),
        location: 'Pan India',
        description: 'Retail banking operations, customer relationship management, and credit analysis.',
        status: 'active'
      }
    ]);

    // 18. Student Service Requests
    if (demoStudent) {
      await ServiceRequest.insertMany([
        {
          userId: demoStudent._id,
          userName: demoStudent.name,
          rollNumber: demoStudent.rollNumber || 'STU-2026-101',
          requestType: 'bonafide',
          subject: 'Bonafide Certificate for Education Loan',
          details: 'Requesting urgent bonafide certificate for passport renewal and bank loan application.',
          status: 'approved',
          adminRemark: 'Approved and digital certificate generated.',
          createdAt: new Date('2026-09-01')
        },
        {
          userId: demoStudent._id,
          userName: demoStudent.name,
          rollNumber: demoStudent.rollNumber || 'STU-2026-101',
          requestType: 'id_card',
          subject: 'Replacement Smart ID Card',
          details: 'Original ID card lost in library; paid Rs. 100 reissue fee online.',
          status: 'pending',
          adminRemark: 'Under processing by admin desk.',
          createdAt: new Date('2026-09-12')
        }
      ]);
    }

    // 19. Faculty Administrative Requests
    await FacultyRequest.insertMany([
      {
        userId: facultyUser._id,
        userName: facultyUser.name,
        facultyId: facultyUser.facultyId,
        department: facultyUser.department,
        requestType: 'lab_equipment',
        subject: 'Request for Additional High-Speed Routers for Computer Lab 1',
        details: 'Need 4 Cisco Enterprise Routers for Advanced Computer Networks practical modules.',
        priority: 'High',
        status: 'pending',
        adminRemark: '',
        createdAt: new Date('2026-09-14')
      },
      {
        userId: facultyUser._id,
        userName: facultyUser.name,
        facultyId: facultyUser.facultyId,
        department: facultyUser.department,
        requestType: 'timetable_correction',
        subject: 'Timetable Adjustment for BSCIT Sem 3 Division B Practical',
        details: 'Request to swap Thursday 10:00 AM slot with Friday 09:00 AM slot due to auditorium guest lecture.',
        priority: 'Medium',
        status: 'approved',
        adminRemark: 'Approved and updated in central timetable system.',
        createdAt: new Date('2026-09-10')
      }
    ]);

    // 20. Notices (Realistic College Announcements - No generic dev version notices)
    await Notice.insertMany([
      {
        title: 'Semester 3 End-Semester Final Examination Schedule Released',
        content: 'End-semester final examinations for all UG and PG programs commence on Oct 10, 2026. Hall tickets are available on the student portal.',
        category: 'academic',
        authorName: 'Dean Arthur Pendelton',
        authorRole: 'Admin',
        authorId: adminUser._id,
        isImportant: true,
        priority: 'High Priority',
        targetAudience: 'All Campus Community'
      },
      {
        title: 'Major Subject ICA 3 & Practical Assessment Guidelines',
        content: 'Faculty members must submit best-two ICA marks and practical scores before Oct 2, 2026.',
        category: 'academic',
        authorName: 'Dr. Vikram Seth',
        authorRole: 'Faculty',
        authorId: facultyUser._id,
        isImportant: true,
        priority: 'Important',
        targetAudience: 'Faculty & Students'
      },
      {
        title: 'TCS Placement Campus Recruitment Registration Open',
        content: 'Eligible BSCIT, BCOM, BMS, MCA, and MSCIT students must register for TCS recruitment drive before Oct 5, 2026.',
        category: 'placement',
        authorName: 'Prof. Richard Davis',
        authorRole: 'Placement Officer',
        authorId: placementAdminUser._id,
        isImportant: false,
        priority: 'Normal',
        targetAudience: 'Final & Pre-Final Year Students'
      },
      {
        title: 'Rotaract Club Youth Leadership Summit 2026',
        content: 'Registration is open for the Annual Youth Leadership Summit hosted by Rotaract Club on Oct 5 in the Main Auditorium.',
        category: 'club',
        authorName: 'Sarah Connor',
        authorRole: 'Club Admin',
        authorId: clubAdminUser._id,
        isImportant: false,
        priority: 'Normal',
        targetAudience: 'All Students'
      }
    ]);

    // 21. Notifications
    if (demoStudent) {
      await Notification.insertMany([
        {
          userId: demoStudent._id,
          title: 'Bonafide Certificate Approved',
          message: 'Your request for Bonafide Certificate has been approved by Admin.',
          type: 'service',
          link: '/services',
          read: false
        },
        {
          userId: demoStudent._id,
          title: 'New Placement Drive Posted',
          message: 'TCS Placement Drive (7.5 LPA) is now open for applications.',
          type: 'placement',
          link: '/placements',
          read: false
        }
      ]);

      await Task.create({
        userId: demoStudent._id,
        title: 'Complete Business Communication Case Study Submission',
        category: 'academic',
        completed: true
      });
    }

    console.log('========================================================================');
    console.log('🎉 CAMPUSONE MASTER DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log(`👉 ~1,380 Students Seeded across 5 UG & 4 PG Courses in all divisions.`);
    console.log(`👉 35+ Faculty Members Seeded with isolated Teaching Assignments.`);
    console.log(`👉 Demo Credentials:`);
    console.log(`   Student:         student@college.edu / password123`);
    console.log(`   Faculty:         faculty@college.edu / password123`);
    console.log(`   Admin:           admin@college.edu / password123`);
    console.log(`   Club Admin:      clubadmin@college.edu / password123`);
    console.log(`   Placement Admin: placement@college.edu / password123`);
    console.log('========================================================================');
  } catch (error) {
    console.error('[Seed] Error during database seeding:', error);
  }
};

if (process.argv[1] && (process.argv[1].includes('seed.js') || process.argv[1].includes('seed'))) {
  const { connectDB } = await import('../config/db.js');
  await connectDB();
  await seedDatabase();
  process.exit(0);
}
