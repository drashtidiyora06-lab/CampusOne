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
    if (studentCount >= 300) {
      console.log('[Seed] V4 Database already seeded with 300+ students. Skipping.');
      return;
    }

    console.log('[Seed] Clearing existing collections for clean V4 Master Seeding...');
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
    await Task.deleteMany({});
    await Timetable.deleteMany({});
    await Syllabus.deleteMany({});
    await Assignment.deleteMany({});
    await ExamSchedule.deleteMany({});
    await Result.deleteMany({});
    await Notification.deleteMany({});

    console.log('[Seed] Seeding CampusOne V4 Master Data...');

    // 1. Courses (5 Core Courses)
    const courses = await Course.insertMany([
      { code: 'BCOM', name: 'Bachelor of Commerce', description: 'Commerce, Accounting & Business Finance', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BSCIT', name: 'B.Sc. Information Technology', description: 'Software Engineering, DBMS & Networks', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BMS', name: 'Bachelor of Management Studies', description: 'Business Management & Leadership', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BAF', name: 'Bachelor of Accounting and Finance', description: 'Financial Analysis & Auditing', totalSemesters: 6, divisions: ['A', 'B'] },
      { code: 'BMM', name: 'Bachelor of Mass Media', description: 'Journalism, Advertising & Public Relations', totalSemesters: 6, divisions: ['A', 'B'] }
    ]);

    // 2. Subjects
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
      { code: 'BMS-303', name: 'Business Statistics', course: 'BMS', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMS-304', name: 'Financial Management', course: 'BMS', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // BAF Sem 3 Subjects
      { code: 'BAF-301', name: 'Cost Accounting', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BAF-302', name: 'Direct Taxation', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BAF-303', name: 'Financial Accounting III', course: 'BAF', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BAF-304', name: 'Business Law II', course: 'BAF', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },

      // BMM Sem 3 Subjects
      { code: 'BMM-301', name: 'Media Studies', course: 'BMM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMM-302', name: 'Creative Writing', course: 'BMM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 },
      { code: 'BMM-303', name: 'Public Relations', course: 'BMM', semester: 3, type: 'Major', hasPractical: false, credits: 4 },
      { code: 'BMM-304', name: 'Mass Communication', course: 'BMM', semester: 3, type: 'Minor', hasPractical: false, credits: 3 }
    ]);

    const subjMap = {};
    subjects.forEach((s) => {
      subjMap[`${s.course}-${s.code}`] = s;
    });

    // 3. Assessment Configuration
    await AssessmentConfig.insertMany([
      { subjectType: 'Major', icaComponentsCount: 3, maxIcaMarks: 25, icaRule: 'BEST_OF_3', maxPracticalMarks: 50, maxFinalExamMarks: 75, passingPercentage: 40 },
      { subjectType: 'Minor', icaComponentsCount: 2, maxIcaMarks: 25, icaRule: 'MEAN_OF_2', maxPracticalMarks: 50, maxFinalExamMarks: 75, passingPercentage: 40 }
    ]);

    // 4. Core Demo Staff & Admin Users
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

    // Seed 25 Faculty Members
    const facultyList = [facultyUser];
    const facultyDepts = [
      { dept: 'Commerce', prefix: 'COMM' },
      { dept: 'Information Technology', prefix: 'IT' },
      { dept: 'Management', prefix: 'BMS' },
      { dept: 'Accounting & Finance', prefix: 'AF' },
      { dept: 'Mass Media', prefix: 'MM' }
    ];

    let facCounter = 2;
    for (const d of facultyDepts) {
      for (let f = 1; f <= 5; f++) {
        const fn = firstNames[(facCounter * 3) % firstNames.length];
        const ln = lastNames[(facCounter * 5) % lastNames.length];
        const fId = `FAC-${d.prefix}-${String(f).padStart(3, '0')}`;
        const fac = await User.create({
          name: `Prof. ${fn} ${ln}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}@college.edu`,
          password: 'password123',
          role: 'faculty',
          facultyId: fId,
          department: d.dept,
          branch: d.dept,
          year: 'Faculty',
          rollNumber: fId,
          bio: `Professor of ${d.dept}`
        });
        facultyList.push(fac);
        facCounter++;
      }
    }
    console.log(`[Seed] Created ${facultyList.length} faculty members.`);

    // 5. Seed 300+ Students (30 Students per Division across 10 Divisions)
    const courseCodes = ['BCOM', 'BSCIT', 'BMS', 'BAF', 'BMM'];
    const divisions = ['A', 'B'];
    const allStudents = [];
    let globalStuIdx = 1;

    for (const courseCode of courseCodes) {
      for (const div of divisions) {
        for (let i = 1; i <= 30; i++) {
          const fn = firstNames[(globalStuIdx * 7) % firstNames.length];
          const ln = lastNames[(globalStuIdx * 11) % lastNames.length];
          const stuIdCode = `${courseCode}-${div}-${String(i).padStart(3, '0')}`;
          
          let email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${courseCode.toLowerCase()}${div.toLowerCase()}${i}@college.edu`;
          let name = `${fn} ${ln}`;
          
          // Primary Demo Student Override for BCOM-A-001
          if (courseCode === 'BCOM' && div === 'A' && i === 1) {
            name = 'Alex Johnson';
            email = 'student@college.edu';
          }

          const student = await User.create({
            name,
            email,
            password: 'password123',
            role: 'student',
            studentId: courseCode === 'BCOM' && div === 'A' && i === 1 ? 'STU-2026-101' : stuIdCode,
            course: courseCode,
            semester: 3,
            division: div,
            academicYear: '2026-27',
            branch: courseCode,
            year: '2nd Year',
            rollNumber: stuIdCode,
            bio: `${courseCode} Semester 3 Division ${div} Student`
          });

          allStudents.push(student);
          globalStuIdx++;
        }
      }
    }
    console.log(`[Seed] Created ${allStudents.length} students across 10 divisions (30 per division).`);

    // 6. CRITICAL TEACHING ASSIGNMENTS
    // Dr. Vikram Seth teaches Business Communication to BCOM-A and BSCIT-B
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

    // Create assignments for all other subjects across courses/divisions using faculty pool
    let facIdx = 1;
    const allAssignments = [taBcomA, taBscitB, taDbms];

    for (const cCode of courseCodes) {
      for (const dCode of divisions) {
        const courseSubjs = subjects.filter((s) => s.course === cCode);
        for (const s of courseSubjs) {
          // Skip if already explicitly created above
          if (cCode === 'BCOM' && dCode === 'A' && s.code === 'BCOM-301') continue;
          if (cCode === 'BSCIT' && dCode === 'B' && (s.code === 'BSCIT-301' || s.code === 'BSCIT-302')) continue;

          const assignedFac = facultyList[facIdx % facultyList.length];
          facIdx++;

          const ta = await TeachingAssignment.create({
            teachingAssignmentId: `TA-${cCode}-${dCode}-${s.code}`,
            teacher: assignedFac._id,
            teacherIdCode: assignedFac.facultyId,
            teacherName: assignedFac.name,
            course: cCode,
            semester: 3,
            division: dCode,
            subject: s._id,
            subjectName: s.name,
            subjectCode: s.code,
            subjectType: s.type,
            hasPractical: s.hasPractical,
            academicYear: '2026-27',
            status: 'active'
          });
          allAssignments.push(ta);
        }
      }
    }
    console.log(`[Seed] Created ${allAssignments.length} teaching assignments.`);

    // 7. Seed Student Marks for All Teaching Assignments
    for (const ta of allAssignments) {
      const classStudents = allStudents.filter(
        (s) => s.course === ta.course && s.division === ta.division
      );

      for (let i = 0; i < classStudents.length; i++) {
        const st = classStudents[i];
        const base = 15 + ((i * 3 + ta.subjectCode.charCodeAt(0)) % 10);
        
        const ica1 = Math.min(25, base + (i % 3));
        const ica2 = Math.min(25, base + 2 - (i % 2));
        const ica3 = ta.subjectType === 'Major' ? Math.min(25, base + 1) : null;
        const practical = ta.hasPractical ? Math.min(50, 35 + (i % 14)) : null;
        const finalExam = Math.min(75, 50 + (i % 23));

        await StudentMarks.create({
          student: st._id,
          studentIdCode: st.studentId,
          studentName: st.name,
          teachingAssignment: ta._id,
          course: ta.course,
          semester: 3,
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
    console.log('[Seed] Populated StudentMarks database records for all 300+ students.');

    // 8. Recalculate Class Results for all 10 divisions
    for (const cCode of courseCodes) {
      for (const dCode of divisions) {
        await recalculateClassResults(cCode, 3, dCode, '2026-27');
      }
    }
    console.log('[Seed] Recalculated Semester 3 V3Results for all 10 divisions.');

    // 9. Seed Historical Semester 1 & Semester 2 Results
    for (const st of allStudents) {
      await V3Result.create({
        student: st._id,
        studentIdCode: st.studentId,
        studentName: st.name,
        course: st.course,
        semester: 1,
        division: st.division,
        academicYear: '2025-26',
        subjectResults: [
          { subjectCode: `${st.course}-101`, subjectName: 'Foundation Course I', totalMarksObtained: 78, totalMaxMarks: 100, percentage: 78, grade: 'A+', status: 'Pass' },
          { subjectCode: `${st.course}-102`, subjectName: 'Core Principles I', totalMarksObtained: 82, totalMaxMarks: 100, percentage: 82, grade: 'O', status: 'Pass' },
          { subjectCode: `${st.course}-103`, subjectName: 'Business Mathematics', totalMarksObtained: 74, totalMaxMarks: 100, percentage: 74, grade: 'A', status: 'Pass' }
        ],
        totalObtained: 234,
        totalMax: 300,
        overallPercentage: 78.0,
        sgpa: 7.8,
        overallGrade: 'A+',
        overallStatus: 'Pass'
      });

      await V3Result.create({
        student: st._id,
        studentIdCode: st.studentId,
        studentName: st.name,
        course: st.course,
        semester: 2,
        division: st.division,
        academicYear: '2025-26',
        subjectResults: [
          { subjectCode: `${st.course}-201`, subjectName: 'Foundation Course II', totalMarksObtained: 81, totalMaxMarks: 100, percentage: 81, grade: 'O', status: 'Pass' },
          { subjectCode: `${st.course}-202`, subjectName: 'Core Principles II', totalMarksObtained: 76, totalMaxMarks: 100, percentage: 76, grade: 'A+', status: 'Pass' },
          { subjectCode: `${st.course}-203`, subjectName: 'Environmental Studies', totalMarksObtained: 85, totalMaxMarks: 100, percentage: 85, grade: 'O', status: 'Pass' }
        ],
        totalObtained: 242,
        totalMax: 300,
        overallPercentage: 80.6,
        sgpa: 8.06,
        overallGrade: 'O',
        overallStatus: 'Pass'
      });
    }
    console.log('[Seed] Populated Historical Semester 1 & 2 Results.');

    // 10. Seed Realistic Attendance Records
    const attendanceDates = [
      new Date('2026-08-01'), new Date('2026-08-04'), new Date('2026-08-08'),
      new Date('2026-08-11'), new Date('2026-08-15'), new Date('2026-08-18'),
      new Date('2026-08-22'), new Date('2026-08-25'), new Date('2026-08-29'),
      new Date('2026-09-02'), new Date('2026-09-05'), new Date('2026-09-09'),
      new Date('2026-09-12'), new Date('2026-09-15')
    ];

    for (const ta of allAssignments.slice(0, 15)) {
      const classStudents = allStudents.filter(s => s.course === ta.course && s.division === ta.division);
      for (const d of attendanceDates) {
        for (let i = 0; i < classStudents.length; i++) {
          const st = classStudents[i];
          const isPresent = (i + d.getDate()) % 7 !== 0; // Realistic present/absent mix
          await Attendance.create({
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
    console.log('[Seed] Populated Attendance records.');

    // 11. Seed Timetables for Courses
    for (const cCode of courseCodes) {
      for (const dCode of divisions) {
        await Timetable.create({
          branch: `${cCode}-${dCode}`,
          semester: '3',
          schedule: [
            {
              day: 'Monday',
              slots: [
                { time: '08:00 AM - 09:00 AM', subject: 'Business Communication', code: `${cCode}-301`, instructor: 'Dr. Vikram Seth', room: 'Room 301' },
                { time: '09:00 AM - 10:00 AM', subject: 'Core Subject I', code: `${cCode}-302`, instructor: 'Prof. Anita Roy', room: 'Lab 2' }
              ]
            },
            {
              day: 'Tuesday',
              slots: [
                { time: '08:00 AM - 09:00 AM', subject: 'Core Subject II', code: `${cCode}-303`, instructor: 'Prof. Rajesh Sharma', room: 'Room 302' },
                { time: '09:00 AM - 10:00 AM', subject: 'Business Communication', code: `${cCode}-301`, instructor: 'Dr. Vikram Seth', room: 'Room 301' }
              ]
            },
            {
              day: 'Wednesday',
              slots: [
                { time: '10:00 AM - 11:00 AM', subject: 'Practical Lab / Case Studies', code: `${cCode}-302`, instructor: 'Dr. Vikram Seth', room: 'Computer Lab 1' }
              ]
            },
            {
              day: 'Thursday',
              slots: [
                { time: '08:00 AM - 09:00 AM', subject: 'Elective Subject', code: `${cCode}-304`, instructor: 'Prof. Meera Nair', room: 'Room 304' }
              ]
            },
            {
              day: 'Friday',
              slots: [
                { time: '09:00 AM - 10:00 AM', subject: 'Seminar & Group Discussion', code: `${cCode}-301`, instructor: 'Dr. Vikram Seth', room: 'Auditorium' }
              ]
            }
          ]
        });
      }
    }

    // 12. Seed Syllabi & Exam Schedules
    for (const s of subjects) {
      await Syllabus.create({
        subject: s.name,
        code: s.code,
        branch: s.course,
        semester: '3',
        credits: s.credits,
        modules: [
          { title: 'Module 1: Fundamental Concepts & Frameworks', topics: ['Introduction & History', 'Core Theoretical Principles', 'Case Studies'] },
          { title: 'Module 2: Advanced Operations & Applications', topics: ['Practical Implementation', 'Industry Standards', 'Problem Solving Methods'] },
          { title: 'Module 3: Project Architecture & Evaluation', topics: ['System Design', 'Performance Metrics', 'Final Review'] }
        ]
      });
    }

    await ExamSchedule.create({
      title: 'End-Semester Final Examinations October 2026',
      branch: 'Undergraduate',
      semester: '3',
      exams: [
        { subject: 'Business Communication', code: 'BCOM-301 / BSCIT-301', date: new Date('2026-10-10'), time: '10:00 AM - 01:00 PM', hall: 'Main Hall A' },
        { subject: 'Database Management Systems', code: 'BSCIT-302', date: new Date('2026-10-12'), time: '10:00 AM - 01:00 PM', hall: 'Computer Lab 1' },
        { subject: 'Corporate Accounting', code: 'BCOM-302', date: new Date('2026-10-14'), time: '10:00 AM - 01:00 PM', hall: 'Hall B' }
      ]
    });

    // 13. Seed Assignments & Submissions
    const demoStudent1 = allStudents.find(s => s.email === 'student@college.edu');
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
          studentId: demoStudent1._id,
          studentName: demoStudent1.name,
          submittedAt: new Date('2026-09-15'),
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileName: 'alex_johnson_case_study.pdf',
          status: 'Submitted'
        }
      ]
    });

    // 14. Seed Resources
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

    // 15. Seed Campus Guide Locations
    await CampusGuide.insertMany([
      { name: 'Central Library', category: 'Academic', location: 'Main Academic Block', building: 'Block A', floor: '2nd Floor', roomNumber: '201', timings: '08:00 AM - 08:00 PM', description: 'Access over 50,000 reference books, digital archives, and quiet study pods.' },
      { name: 'Advanced Computer Lab 1', category: 'Labs', location: 'IT Wing', building: 'Block B', floor: '1st Floor', roomNumber: '104', timings: '08:30 AM - 05:30 PM', description: 'High-performance computing laboratory equipped with 60 workstations and high-speed fiber internet.' },
      { name: 'Science & Electronics Lab', category: 'Labs', location: 'Science Wing', building: 'Block C', floor: 'Ground Floor', roomNumber: '002', timings: '09:00 AM - 05:00 PM', description: 'State-of-the-art physics, chemistry, and electronics testing equipment.' },
      { name: 'Main Auditorium', category: 'Facilities', location: 'Campus Grounds', building: 'Auditorium Complex', floor: 'Ground Floor', roomNumber: 'AUD-1', timings: 'Event Based', description: 'Air-conditioned 1,200 seat theater with 4K projection and acoustic sound system.' },
      { name: 'Student Canteen', category: 'Dining', location: 'Student Plaza', building: 'Plaza Center', floor: 'Ground Floor', roomNumber: 'CN-1', timings: '07:30 AM - 07:00 PM', description: 'Hygienic multi-cuisine cafeteria providing fresh meals, beverages, and snacks.' },
      { name: 'Administration Office', category: 'Admin', location: 'Main Administrative Building', building: 'Block A', floor: 'Ground Floor', roomNumber: '101', timings: '09:30 AM - 04:30 PM', description: 'College registrar, fee collection counters, and general inquiries.' },
      { name: 'Examination Cell', category: 'Admin', location: 'Administrative Block', building: 'Block A', floor: '1st Floor', roomNumber: '112', timings: '10:00 AM - 04:00 PM', description: 'Official hall ticket issuance, grade transcript verification, and re-evaluation applications.' },
      { name: 'Placement Cell', category: 'Career', location: 'Placement Building', building: 'Block D', floor: '3rd Floor', roomNumber: '305', timings: '09:00 AM - 05:00 PM', description: 'Corporate recruitment desk, interview rooms, and career guidance center.' },
      { name: 'Student Help Desk', category: 'Support', location: 'Student Activity Center', building: 'Block B', floor: 'Ground Floor', roomNumber: '010', timings: '09:00 AM - 05:00 PM', description: 'First point of contact for service requests, bonafide certificates, and lost-and-found.' },
      { name: 'Sports Complex & Gymnasium', category: 'Recreation', location: 'South Campus', building: 'Sports Complex', floor: 'Ground Floor', roomNumber: 'SP-1', timings: '06:00 AM - 07:00 PM', description: 'Indoor basketball court, badminton courts, table tennis, and modern fitness gym.' }
    ]);

    // 16. Seed Clubs
    await Club.insertMany([
      {
        name: 'Rotaract Club of CampusOne',
        category: 'Social Service',
        description: 'Fostering leadership, youth development, and community welfare initiatives.',
        coordinator: 'Sarah Connor',
        email: 'rotaract@college.edu',
        membersCount: 140,
        activities: ['Community Service', 'Leadership Workshops', 'Youth Summits'],
        events: [
          { title: 'Annual Youth Leadership Summit 2026', date: new Date('2026-10-05'), location: 'Main Auditorium', description: 'Inter-college leadership panel and keynote sessions.' }
        ]
      },
      {
        name: 'NSS (National Service Scheme)',
        category: 'Social Service',
        description: 'Not Me But You — selfless community service and rural outreach programs.',
        coordinator: 'Prof. Rajesh Sharma',
        email: 'nss@college.edu',
        membersCount: 210,
        activities: ['Blood Donation Camps', 'Tree Plantation Drives', 'Rural Literacy Camps'],
        events: [
          { title: 'Mega Campus Blood Donation Camp', date: new Date('2026-09-28'), location: 'Student Plaza', description: 'Annual blood donation drive in association with City Red Cross.' }
        ]
      },
      {
        name: 'DLLE (Department of Lifelong Learning & Extension)',
        category: 'Extension Work',
        description: 'Promoting community outreach, career guidance, and social survey projects.',
        coordinator: 'Prof. Meera Nair',
        email: 'dlle@college.edu',
        membersCount: 110,
        activities: ['Status of Women in Society Survey', 'Senior Citizen Digital Literacy'],
        events: [
          { title: 'DLLE Community Survey Exhibition', date: new Date('2026-10-18'), location: 'Exhibition Hall B', description: 'Student presentation of research survey findings.' }
        ]
      },
      {
        name: 'Cultural Club & Performing Arts',
        category: 'Arts & Culture',
        description: 'Hub for music, dance, drama, fashion, and inter-college cultural festivals.',
        coordinator: 'Prof. Anita Roy',
        email: 'cultural@college.edu',
        membersCount: 180,
        activities: ['Annual Fest Tarang', 'Drama Workshops', 'Musical Nights']
      },
      {
        name: 'Coding & Tech Innovators Club',
        category: 'Technical',
        description: 'Competitive programming, hackathons, open-source software, and AI workshops.',
        coordinator: 'Dr. Vikram Seth',
        email: 'techclub@college.edu',
        membersCount: 160,
        activities: ['24-Hour Hackathon', 'Python Bootcamp', 'Open Source Sprint']
      },
      {
        name: 'Sports & Athletics Association',
        category: 'Sports',
        description: 'Organizing inter-departmental tournaments in cricket, football, chess, and track events.',
        coordinator: 'Prof. Arjun Verma',
        email: 'sports@college.edu',
        membersCount: 220,
        activities: ['Annual Sports Meet', 'Inter-College Football League']
      },
      {
        name: 'Literary & Debating Society',
        category: 'Literary',
        description: 'Model UN, parliamentary debates, creative writing competitions, and book clubs.',
        coordinator: 'Prof. Sunita Patil',
        email: 'literary@college.edu',
        membersCount: 95,
        activities: ['National Parliamentary Debate', 'Poetry Slam']
      },
      {
        name: 'E-Cell (Entrepreneurship Cell)',
        category: 'Business',
        description: 'Empowering student startups with mentorship, pitch competitions, and angel funding connections.',
        coordinator: 'Prof. Suresh Kulkarni',
        email: 'ecell@college.edu',
        membersCount: 130,
        activities: ['Startup Pitch Fest', 'Founder Speaker Series']
      }
    ]);

    // 17. Seed Placement Drives
    await PlacementDrive.insertMany([
      {
        companyName: 'TCS (Tata Consultancy Services)',
        logoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=80',
        jobRole: 'Graduate Trainee / Software Engineer',
        package: '7.5 LPA',
        eligibilityCriteria: 'BSCIT / BCOM with Min 60% (6.5 CGPA)',
        eligibleCourses: ['BSCIT', 'BCOM', 'BMS'],
        driveDate: new Date('2026-10-15'),
        applicationDeadline: new Date('2026-10-05'),
        location: 'Mumbai / Pune',
        description: 'Campus placement drive for software development, cloud infrastructure, and business analytics roles.',
        rounds: ['Online Aptitude Test', 'Technical Coding Interview', 'HR Interview'],
        status: 'Active',
        applicantsCount: 85
      },
      {
        companyName: 'Deloitte India',
        logoUrl: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=120&auto=format&fit=crop&q=80',
        jobRole: 'Associate Risk & Financial Analyst',
        package: '8.2 LPA',
        eligibilityCriteria: 'BAF / BCOM / BMS with Min 70% (7.5 CGPA)',
        eligibleCourses: ['BAF', 'BCOM', 'BMS'],
        driveDate: new Date('2026-10-22'),
        applicationDeadline: new Date('2026-10-12'),
        location: 'Mumbai / Bengaluru',
        description: 'Financial auditing, tax advisory, and risk assessment consultant positions.',
        rounds: ['Resume Screening', 'Case Study Assessment', 'Partner Interview'],
        status: 'Active',
        applicantsCount: 62
      },
      {
        companyName: 'HDFC Bank',
        logoUrl: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=120&auto=format&fit=crop&q=80',
        jobRole: 'Management Trainee - Retail Banking',
        package: '6.8 LPA',
        eligibilityCriteria: 'BMS / BAF / BCOM Min 60%',
        eligibleCourses: ['BMS', 'BAF', 'BCOM'],
        driveDate: new Date('2026-11-02'),
        applicationDeadline: new Date('2026-10-25'),
        location: 'Pan India',
        description: 'Retail banking operations, customer relationship management, and credit analysis.',
        rounds: ['Group Discussion', 'Personal Interview'],
        status: 'Active',
        applicantsCount: 45
      },
      {
        companyName: 'Infosys BPM',
        logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=120&auto=format&fit=crop&q=80',
        jobRole: 'Process Associate - IT & Media',
        package: '5.5 LPA',
        eligibilityCriteria: 'All Undergraduates (Min 55%)',
        eligibleCourses: ['BSCIT', 'BCOM', 'BMS', 'BAF', 'BMM'],
        driveDate: new Date('2026-11-10'),
        applicationDeadline: new Date('2026-10-30'),
        location: 'Pune',
        description: 'Digital operations, content management, and IT helpdesk support.',
        rounds: ['Communication Assessment', 'HR Round'],
        status: 'Active',
        applicantsCount: 110
      }
    ]);

    // 18. Seed Student Service Requests
    await ServiceRequest.insertMany([
      {
        studentId: demoStudent1._id,
        studentName: demoStudent1.name,
        requestType: 'Bonafide Certificate',
        subject: 'Bonafide Certificate for Education Loan',
        description: 'Requesting urgent bonafide certificate for passport renewal and bank loan application.',
        status: 'Approved',
        adminRemarks: 'Approved and digital certificate generated.',
        createdAt: new Date('2026-09-01')
      },
      {
        studentId: demoStudent1._id,
        studentName: demoStudent1.name,
        requestType: 'ID Card Reissue',
        subject: 'Replacement Smart ID Card',
        description: 'Original ID card lost in library; paid Rs. 100 reissue fee online.',
        status: 'Pending',
        adminRemarks: 'Under processing by admin desk.',
        createdAt: new Date('2026-09-12')
      }
    ]);

    // 19. Seed Notices & College Announcements
    await Notice.insertMany([
      {
        title: 'CampusOne V4 Full College Management Platform Launched',
        content: 'CampusOne V4 is now fully live with integrated examinations, isolated teaching assignments, student services, and placement drives.',
        category: 'academic',
        authorName: 'Dean Arthur Pendelton',
        authorRole: 'Admin',
        authorId: adminUser._id,
        isImportant: true,
        priority: 'High Priority',
        targetAudience: 'All Campus Community'
      },
      {
        title: 'Semester 3 End-Semester Final Examination Schedule Released',
        content: 'End-semester final examinations for BCOM, BSCIT, BMS, BAF, and BMM commence on Oct 10, 2026. Hall tickets available on student portal.',
        category: 'academic',
        authorName: 'Dr. Vikram Seth',
        authorRole: 'Faculty',
        authorId: facultyUser._id,
        isImportant: true,
        priority: 'Important',
        targetAudience: 'All Undergraduates'
      },
      {
        title: 'TCS Placement Campus Recruitment Registration Open',
        content: 'Eligible BSCIT, BCOM, and BMS students must register for TCS recruitment before Oct 5, 2026.',
        category: 'placement',
        authorName: 'Prof. Richard Davis',
        authorRole: 'Placement Officer',
        authorId: placementAdminUser._id,
        isImportant: false,
        priority: 'Normal',
        targetAudience: 'Final & Pre-Final Year Students'
      }
    ]);

    // 20. Seed User Notifications & Tasks
    await Notification.insertMany([
      {
        user: demoStudent1._id,
        title: 'Bonafide Certificate Approved',
        message: 'Your request for Bonafide Certificate has been approved by Admin.',
        link: '/services',
        read: false
      },
      {
        user: demoStudent1._id,
        title: 'New Placement Drive Posted',
        message: 'TCS Placement Drive (7.5 LPA) is now open for applications.',
        link: '/placements',
        read: false
      },
      {
        user: facultyUser._id,
        title: 'Marks Management Active',
        message: 'You have active teaching assignments for BCOM-A and BSCIT-B.',
        link: '/teacher/marks',
        read: false
      }
    ]);

    await Task.create({
      user: demoStudent1._id,
      title: 'Complete Business Communication Case Study Submission',
      category: 'Academic',
      completed: true
    });
    await Task.create({
      user: demoStudent1._id,
      title: 'Prepare for Mid-Semester DBMS Practical Exam',
      category: 'Exam Prep',
      completed: false
    });

    console.log('========================================================================');
    console.log('🎉 CAMPUSONE V4 MASTER DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('👉 300+ Students Seeded across 5 Courses & 10 Divisions.');
    console.log('👉 25+ Faculty Members Seeded with isolated Teaching Assignments.');
    console.log('👉 Critical Test Case Dr. Vikram Seth (FAC-2026-001) seeded with BCOM-A & BSCIT-B.');
    console.log('👉 Full Examination, Marks, Results, Attendance, Timetables, Placements & Services live!');
    console.log('========================================================================');
  } catch (error) {
    console.error('[Seed] Error during V4 database seeding:', error);
  }
};

if (process.argv[1] && (process.argv[1].includes('seed.js') || process.argv[1].includes('seed'))) {
  const { connectDB } = await import('../config/db.js');
  await connectDB();
  await seedDatabase();
  process.exit(0);
}

