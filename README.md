# CampusOne - Full-Stack Campus Companion Monorepo

CampusOne is a full-stack campus companion app monorepo for college students, faculty, club leaders, and placement administrators available on **Web and Mobile** powered by a shared Node.js + Express + MongoDB backend.
Drive link:-https://drive.google.com/drive/folders/1PFiMWqaU4q4VszARvxMWm4nUxW4hsd_O?usp=sharing
App Link:-https://campusone-ovwl.onrender.com

Team members:
Nyasa Salot 53013240053
Kirti Patil 53013240045
Drashti Diyora 53013240048
Purva Sakpal 53013240047

---

## Repo Structure

```
CampusOne/
├── backend/        # Shared REST API (Node.js + Express + MongoDB)
├── frontend/       # Web App (React 19 + Vite + CSS Design Tokens)
├── mobile/         # Mobile App (React Native + Expo + React Navigation)
└── README.md
```

---

## Features (9 Core Modules)

1. **Authentication & Onboarding:** JWT authentication, role-based accounts (Student, Club Admin, Placement Cell/Admin, Faculty), email verification, and quick role switcher.
2. **Academics:** Weekly class timetable view, course syllabus list, assignment submission portal, and exam results gradecard.
3. **Student Resources:** Notes & PYQs repository with subject/semester filters, file upload modal, and download counter.
4. **Campus Guide:** Key campus places (Library, AI Lab, Food Court, Admin office) with Open/Closed badges, timings, and contacts.
5. **Clubs & Societies:** Campus clubs directory, event timelines, live member counts, join club button, and event publishing modal.
6. **Placement Cell:** Active recruitment drives, CTC salary tags, CGPA cutoff checker, Apply button, and ATS resume template downloads.
7. **Student Services:** Request portal for ID card reissue, bonafide certificates, hostel complaints, and fee receipts with admin approval.
8. **Productivity:** To-do task checklist with priority pills & integrated Pomodoro Focus Study Timer.
9. **Notices & Announcements:** Categorized announcement feed with high-priority alert banners and posting permissions.

---

## How to Run

### 1. Backend REST API (`backend/`)
```bash
cd backend
npm install
npm run dev
```
- Listens on `http://localhost:5000/api`.
- Connects automatically to local MongoDB or MongoMemoryServer fallback with auto-seeded campus data!

### 2. Web Application (`frontend/`)
```bash
cd frontend
npm install
npm run dev
```
- Open `http://localhost:5173`.

### 3. Mobile Application (`mobile/`)
```bash
cd mobile
npm install
npx expo start
```
- Scan QR code via Expo Go app or test in web browser preview mode (`npx expo start --web`).
