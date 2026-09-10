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

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already seeded. Skipping.');
      return;
    }

    console.log('[Seed] Seeding database with initial CampusOne campus data...');

    // 1. Users
    const studentUser = await User.create({
      name: 'Alex Johnson',
      email: 'student@college.edu',
      password: 'password123',
      role: 'student',
      branch: 'Computer Science',
      year: '3rd Year',
      rollNumber: 'CS2026-104',
      bio: 'CS Undergrad passionate about WebDev & AI.'
    });

    const clubAdminUser = await User.create({
      name: 'Sarah Connor',
      email: 'clubadmin@college.edu',
      password: 'password123',
      role: 'club_admin',
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
      branch: 'Placement Cell',
      year: 'Faculty',
      rollNumber: 'FAC-PL-009',
      bio: 'Chief Placement Officer'
    });

    const facultyUser = await User.create({
      name: 'Dr. Vikram Seth',
      email: 'faculty@college.edu',
      password: 'password123',
      role: 'faculty',
      branch: 'Computer Science',
      year: 'Faculty',
      rollNumber: 'FAC-CS-022',
      bio: 'Associate Professor, DBMS & Algorithms'
    });

    // 2. Notices
    await Notice.insertMany([
      {
        title: 'Mid-Semester Examination Schedule Announced',
        content: 'Mid-term exams for 3rd and 4th-year students will commence from Sept 15, 2026. Hall tickets are available on the student portal.',
        category: 'academic',
        authorName: 'Dr. Vikram Seth',
        authorRole: 'Faculty',
        authorId: facultyUser._id,
        isImportant: true,
        targetAudience: '3rd & 4th Year Students'
      },
      {
        title: 'Microsoft On-Campus Placement Drive 2026',
        content: 'Microsoft will be conducting an on-campus placement drive for SDE-1 roles on Sept 22. CGPA cut-off is 8.0. Register before Sept 12.',
        category: 'placement',
        authorName: 'Prof. Richard Davis',
        authorRole: 'Placement Admin',
        authorId: placementAdminUser._id,
        isImportant: true,
        targetAudience: 'Final Year B.Tech'
      },
      {
        title: 'HackCampus 2026 - Annual 36hr Hackathon',
        content: 'Registration is now open for HackCampus 2026! Cash prizes worth $5,000. Form teams of 2 to 4 members. Free meals and swag provided!',
        category: 'club',
        authorName: 'Sarah Connor',
        authorRole: 'Club Admin',
        authorId: clubAdminUser._id,
        isImportant: false,
        targetAudience: 'All College Students'
      },
      {
        title: 'Central Library Extended Operating Hours',
        content: 'In view of the upcoming exams, Central Library will remain open 24/7 with Wi-Fi and quiet study pods starting Sept 5th.',
        category: 'general',
        authorName: 'Campus Admin',
        authorRole: 'Admin',
        isImportant: false,
        targetAudience: 'All Students & Staff'
      }
    ]);

    // 3. Academics
    await Timetable.create({
      branch: 'Computer Science',
      semester: '6',
      schedule: [
        {
          day: 'Monday',
          slots: [
            { time: '09:00 AM - 10:00 AM', subject: 'Database Management Systems', code: 'CS301', instructor: 'Dr. Vikram Seth', room: 'LH-102' },
            { time: '10:15 AM - 11:15 AM', subject: 'Compiler Design', code: 'CS302', instructor: 'Prof. Anita Roy', room: 'LH-102' },
            { time: '11:30 AM - 12:30 PM', subject: 'Computer Networks', code: 'CS303', instructor: 'Dr. Ramesh Kumar', room: 'LH-105' },
            { time: '02:00 PM - 04:00 PM', subject: 'DBMS Lab (Batch A)', code: 'CS301L', instructor: 'Dr. Vikram Seth', room: 'Lab-4' }
          ]
        },
        {
          day: 'Tuesday',
          slots: [
            { time: '09:00 AM - 10:00 AM', subject: 'Machine Learning Fundamentals', code: 'CS304', instructor: 'Prof. Swati Sen', room: 'LH-104' },
            { time: '10:15 AM - 11:15 AM', subject: 'Software Engineering', code: 'CS305', instructor: 'Dr. Ankit Mehta', room: 'LH-104' },
            { time: '01:30 PM - 03:30 PM', subject: 'Networks Security Lab', code: 'CS303L', instructor: 'Dr. Ramesh Kumar', room: 'Lab-2' }
          ]
        },
        {
          day: 'Wednesday',
          slots: [
            { time: '09:00 AM - 10:00 AM', subject: 'Database Management Systems', code: 'CS301', instructor: 'Dr. Vikram Seth', room: 'LH-102' },
            { time: '10:15 AM - 11:15 AM', subject: 'Compiler Design', code: 'CS302', instructor: 'Prof. Anita Roy', room: 'LH-102' },
            { time: '11:30 AM - 12:30 PM', subject: 'Machine Learning Fundamentals', code: 'CS304', instructor: 'Prof. Swati Sen', room: 'LH-104' }
          ]
        },
        {
          day: 'Thursday',
          slots: [
            { time: '09:00 AM - 11:00 AM', subject: 'ML Project Presentation', code: 'CS304P', instructor: 'Prof. Swati Sen', room: 'Seminar Hall B' },
            { time: '11:30 AM - 12:30 PM', subject: 'Software Engineering', code: 'CS305', instructor: 'Dr. Ankit Mehta', room: 'LH-104' }
          ]
        },
        {
          day: 'Friday',
          slots: [
            { time: '09:00 AM - 10:00 AM', subject: 'Computer Networks', code: 'CS303', instructor: 'Dr. Ramesh Kumar', room: 'LH-105' },
            { time: '10:15 AM - 11:15 AM', subject: 'Open Elective: Cyber Law', code: 'OE301', instructor: 'Prof. S. Rao', room: 'Auditorium' },
            { time: '02:00 PM - 04:00 PM', subject: 'Web Dev Capstone Lab', code: 'CS306L', instructor: 'Dr. Ankit Mehta', room: 'Lab-1' }
          ]
        }
      ]
    });

    await Syllabus.insertMany([
      {
        subject: 'Database Management Systems',
        code: 'CS301',
        branch: 'Computer Science',
        semester: '6',
        credits: 4,
        modules: [
          { title: 'Module 1: Relational Model & ER Diagrams', topics: ['Entity-Relationship Data Model', 'Relational Algebra', 'Tuple Relational Calculus'] },
          { title: 'Module 2: SQL & Normalization', topics: ['DDL, DML, DCL Statements', 'Complex Queries & Joins', '1NF, 2NF, 3NF, BCNF Normalization'] },
          { title: 'Module 3: Transaction & Concurrency Control', topics: ['ACID Properties', 'Serializability', 'Two-Phase Locking', 'Deadlock Handling'] }
        ]
      },
      {
        subject: 'Machine Learning Fundamentals',
        code: 'CS304',
        branch: 'Computer Science',
        semester: '6',
        credits: 4,
        modules: [
          { title: 'Module 1: Supervised Learning', topics: ['Linear & Logistic Regression', 'Decision Trees & Random Forests', 'Support Vector Machines'] },
          { title: 'Module 2: Neural Networks & Deep Learning', topics: ['Perceptrons', 'Backpropagation Algorithm', 'CNNs & Sequence Models'] }
        ]
      }
    ]);

    await Assignment.insertMany([
      {
        title: 'B+ Tree Implementation & Query Execution Plan',
        subject: 'Database Management Systems',
        branch: 'Computer Science',
        year: '3rd Year',
        dueDate: new Date(Date.now() + 86400000 * 5),
        maxMarks: 100,
        description: 'Design and submit a C++/Java implementation of a 2-3 B+ Tree indexed database file with query execution logging.'
      },
      {
        title: 'Mini Machine Learning Pipeline on Housing Price Dataset',
        subject: 'Machine Learning Fundamentals',
        branch: 'Computer Science',
        year: '3rd Year',
        dueDate: new Date(Date.now() + 86400000 * 8),
        maxMarks: 50,
        description: 'Build a Scikit-Learn pipeline performing feature engineering, hyperparameter tuning, and cross-validation score analysis.'
      }
    ]);

    await ExamSchedule.create({
      title: 'Mid-Semester Examinations Sept 2026',
      branch: 'Computer Science',
      semester: '6',
      exams: [
        { subject: 'Database Management Systems', code: 'CS301', date: new Date('2026-09-15T09:30:00'), time: '09:30 AM - 11:30 AM', hall: 'Exam Block A (Room 201)' },
        { subject: 'Compiler Design', code: 'CS302', date: new Date('2026-09-17T09:30:00'), time: '09:30 AM - 11:30 AM', hall: 'Exam Block A (Room 201)' },
        { subject: 'Computer Networks', code: 'CS303', date: new Date('2026-09-19T09:30:00'), time: '09:30 AM - 11:30 AM', hall: 'Exam Block B (Room 105)' },
        { subject: 'Machine Learning', code: 'CS304', date: new Date('2026-09-21T09:30:00'), time: '09:30 AM - 11:30 AM', hall: 'Exam Block B (Room 105)' }
      ]
    });

    await Result.create({
      studentId: studentUser._id,
      rollNumber: studentUser.rollNumber,
      semester: '5th Semester',
      cgpa: 8.85,
      sgpa: 9.1,
      subjects: [
        { code: 'CS501', name: 'Operating Systems', grade: 'A+', credits: 4 },
        { code: 'CS502', name: 'Design & Analysis of Algorithms', grade: 'A', credits: 4 },
        { code: 'CS503', name: 'Theory of Computation', grade: 'A', credits: 3 },
        { code: 'CS504', name: 'Web Engineering', grade: 'O', credits: 4 }
      ]
    });

    // 4. Resources
    await Resource.insertMany([
      {
        title: 'Complete DBMS Lecture Notes (Modules 1-5)',
        subject: 'Database Management Systems',
        semester: 'Semester 6',
        branch: 'Computer Science',
        category: 'Lecture Notes',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'dbms_complete_notes_2026.pdf',
        fileSize: '4.2 MB',
        uploadedByName: 'Dr. Vikram Seth',
        downloadsCount: 142
      },
      {
        title: 'Compiler Design Previous Year Questions (2021-2025)',
        subject: 'Compiler Design',
        semester: 'Semester 6',
        branch: 'Computer Science',
        category: 'PYQs',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'compiler_design_pyq_solved.pdf',
        fileSize: '3.1 MB',
        uploadedByName: 'Sarah Connor',
        downloadsCount: 98
      },
      {
        title: 'Computer Networks Packet Tracer Lab Manual',
        subject: 'Computer Networks',
        semester: 'Semester 6',
        branch: 'Computer Science',
        category: 'Lab Manual',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileName: 'networks_lab_manual_v3.pdf',
        fileSize: '1.8 MB',
        uploadedByName: 'Prof. Ramesh Kumar',
        downloadsCount: 76
      }
    ]);

    // 5. Campus Guide
    await CampusGuide.insertMany([
      {
        name: 'Central Knowledge Library',
        category: 'library',
        location: 'Academic Block 1, 2nd Floor',
        timings: '08:00 AM - 10:00 PM (24/7 during Exams)',
        isOpen: true,
        contact: '+91 98765 43210',
        email: 'library@college.edu',
        description: 'Multi-story central library with 50,000+ physical books, IEEE Xplore digital access, private study cubicles, and quiet discussion rooms.',
        features: ['24/7 Study Hall', 'Free High-speed Wi-Fi', 'Book Reservation Desk', 'Photocopy & Print Station'],
        imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60'
      },
      {
        name: 'AI & Advanced Computing Lab',
        category: 'lab',
        location: 'Tech Tower, 3rd Floor, Room 304',
        timings: '09:00 AM - 07:00 PM',
        isOpen: true,
        contact: '+91 98765 43211',
        email: 'ailab@college.edu',
        description: 'Equipped with 60 Nvidia RTX GPU workstations, deep learning frameworks, high-end server racks for research projects.',
        features: ['Nvidia RTX Workstations', 'HPC Server Access', '3D Printer', 'VR Headsets'],
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=60'
      },
      {
        name: 'Campus Food Court & Bistro',
        category: 'canteen',
        location: 'Student Center Plaza',
        timings: '07:30 AM - 11:00 PM',
        isOpen: true,
        contact: '+91 98765 43212',
        email: 'foodcourt@college.edu',
        description: 'Multi-cuisine food hub serving breakfast, healthy bowls, artisan coffee, fresh juices, and dinner options at subsidized student rates.',
        features: ['Multi-cuisine Stalls', 'Digital Order Kiosk', 'Outdoor Seating Deck', 'Juice & Coffee Bar'],
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=60'
      },
      {
        name: 'Administrative Affairs Office',
        category: 'admin',
        location: 'Main Administrative Block, Ground Floor',
        timings: '09:30 AM - 05:00 PM (Mon-Fri)',
        isOpen: false,
        contact: '+91 98765 43213',
        email: 'admin@college.edu',
        description: 'Handles student bonafide letters, fee challans, ID card replacements, transcript verifications, and scholarship counters.',
        features: ['Token Queue System', 'Help Desk', 'Fee Receipt Counter'],
        imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=60'
      }
    ]);

    // 6. Clubs
    await Club.insertMany([
      {
        name: 'CodeCraft Developers Society',
        category: 'Technical',
        description: 'The flagship open-source, competitive programming, and web development student chapter of CampusOne.',
        logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60',
        adminName: 'Sarah Connor',
        adminEmail: 'clubadmin@college.edu',
        membersCount: 245,
        members: [studentUser._id, clubAdminUser._id],
        events: [
          {
            title: 'HackCampus 2026 Kickoff',
            description: 'Introductory bootcamp and team formation mixer for the annual flagship 36-hour hackathon.',
            date: new Date(Date.now() + 86400000 * 7),
            venue: 'Main Auditorium',
            imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60',
            registeredCount: 120
          },
          {
            title: 'System Design 101 Workshop',
            description: 'Learn how to scale databases, design load balancers, and build resilient distributed microservices.',
            date: new Date(Date.now() + 86400000 * 14),
            venue: 'Seminar Hall 2',
            imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=60',
            registeredCount: 85
          }
        ]
      },
      {
        name: 'Beat Drop Music & Cultural Club',
        category: 'Cultural',
        description: 'Vibrant student society celebrating acoustic music, band jams, dance choreography, and inter-college cultural fests.',
        logoUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=60',
        adminName: 'Rohan Sharma',
        adminEmail: 'beatdrop@college.edu',
        membersCount: 180,
        members: [],
        events: [
          {
            title: 'Unplugged Sunset Jam Acoustic Night',
            description: 'Relax after classes with acoustic covers, open mic poetry, and warm coffee under the amphitheater stars.',
            date: new Date(Date.now() + 86400000 * 4),
            venue: 'Open Air Amphitheater',
            imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60',
            registeredCount: 210
          }
        ]
      }
    ]);

    // 7. Placement Drives & Placement Resources
    await PlacementDrive.insertMany([
      {
        companyName: 'Microsoft Corporation',
        logoUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=60',
        role: 'Software Development Engineer - I (SDE 1)',
        ctc: '24.5 LPA',
        location: 'Hyderabad / Bangalore',
        minCgpa: 8.0,
        eligibleBranches: ['Computer Science', 'Information Technology', 'Electronics'],
        driveDate: new Date(Date.now() + 86400000 * 12),
        deadlineDate: new Date(Date.now() + 86400000 * 6),
        status: 'active',
        description: 'Full-time engineering position working on Azure Cloud, Microsoft 365, and AI Core infrastructure teams.',
        applicants: [
          { studentId: studentUser._id, studentName: studentUser.name, cgpa: 8.85, appliedAt: new Date(), status: 'Applied' }
        ]
      },
      {
        companyName: 'Amazon Web Services (AWS)',
        logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=600&auto=format&fit=crop&q=60',
        role: 'Cloud Security Analyst',
        ctc: '20.0 LPA',
        location: 'Bangalore',
        minCgpa: 7.5,
        eligibleBranches: ['Computer Science', 'Information Technology', 'Cyber Security'],
        driveDate: new Date(Date.now() + 86400000 * 18),
        deadlineDate: new Date(Date.now() + 86400000 * 10),
        status: 'upcoming',
        description: 'Join the world leading cloud infrastructure team auditing security protocols, IAM policies, and cloud threat intelligence.',
        applicants: []
      }
    ]);

    await PlacementResource.insertMany([
      {
        title: 'Top 50 Data Structures & Algorithms Interview Sheet',
        category: 'Interview Guide',
        company: 'All Product Companies',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Curated list of must-solve LeetCode medium/hard patterns with optimal C++ and Python solutions.'
      },
      {
        title: 'SDE Resume Format (ATS Approved Template)',
        category: 'Resume Template',
        company: 'General Placement Cell',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        description: 'Official single-page LaTeX resume template optimized for automated ATS parsers.'
      }
    ]);

    // 8. Service Requests
    await ServiceRequest.insertMany([
      {
        userId: studentUser._id,
        userName: studentUser.name,
        rollNumber: studentUser.rollNumber,
        requestType: 'bonafide',
        subject: 'Bonafide Certificate for Education Loan Application',
        details: 'Requesting an official college bonafide certificate for bank loan processing for academic year 2026-27.',
        status: 'approved',
        adminRemark: 'Approved. Collect signed certificate copy from Admin Counter #3.',
        resolvedAt: new Date()
      },
      {
        userId: studentUser._id,
        userName: studentUser.name,
        rollNumber: studentUser.rollNumber,
        requestType: 'id_card',
        subject: 'Replacement Smart RFID Student ID Card',
        details: 'My original student ID card was damaged during lab class. Requesting reissue.',
        status: 'pending',
        adminRemark: ''
      }
    ]);

    // 9. Tasks
    await Task.insertMany([
      {
        userId: studentUser._id,
        title: 'Submit DBMS B+ Tree Assignment',
        category: 'academic',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 4),
        completed: false
      },
      {
        userId: studentUser._id,
        title: 'Revise Dynamic Programming for Microsoft Coding Test',
        category: 'placement',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 5),
        completed: false
      },
      {
        userId: studentUser._id,
        title: 'Review HackCampus 2026 Team Registration Form',
        category: 'personal',
        priority: 'medium',
        dueDate: new Date(Date.now() + 86400000 * 6),
        completed: true
      }
    ]);

    console.log('[Seed] Database successfully seeded with rich mock data for all 9 modules!');
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
  }
};
