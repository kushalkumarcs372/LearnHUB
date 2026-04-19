/* eslint-disable no-console */
// Generates a beginner-friendly PDF report for this repo (frontend + backend).
// Output: docs/LearnHub_Project_Report.pdf
//
// Run:
//   node tools/generate_learnhub_project_report.js

const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");

const OUT_DIR = path.resolve(__dirname, "..", "docs");
const OUT_FILE = path.join(OUT_DIR, "LearnHub_Project_Report.pdf");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function fmtDate(d) {
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function createWriter(doc, opts) {
  const margin = opts.margin ?? 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;

  let cursorY = margin;

  const styles = {
    title: { font: "helvetica", style: "bold", size: 20, lineGap: 8 },
    subtitle: { font: "helvetica", style: "normal", size: 12, lineGap: 6 },
    h1: { font: "helvetica", style: "bold", size: 16, lineGap: 8 },
    h2: { font: "helvetica", style: "bold", size: 13, lineGap: 7 },
    body: { font: "helvetica", style: "normal", size: 11, lineGap: 6 },
    mono: { font: "courier", style: "normal", size: 10, lineGap: 5 },
    small: { font: "helvetica", style: "normal", size: 9, lineGap: 4 },
  };

  function setStyle(s) {
    doc.setFont(s.font, s.style);
    doc.setFontSize(s.size);
  }

  function ensureSpace(neededHeight) {
    const bottomLimit = pageHeight - margin;
    if (cursorY + neededHeight <= bottomLimit) return;
    doc.addPage();
    cursorY = margin;
  }

  function writeLines(lines, style) {
    setStyle(style);
    const lineHeight = style.size + style.lineGap;
    for (const line of lines) {
      ensureSpace(lineHeight);
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    }
  }

  function wrap(text, style) {
    setStyle(style);
    return doc.splitTextToSize(text, contentWidth);
  }

  function spacer(px) {
    ensureSpace(px);
    cursorY += px;
  }

  function paragraph(text) {
    const lines = wrap(text, styles.body);
    writeLines(lines, styles.body);
    spacer(6);
  }

  function bullet(text) {
    const prefix = "- ";
    const lines = wrap(prefix + text, styles.body);
    writeLines(lines, styles.body);
  }

  function bullets(items) {
    for (const it of items) bullet(it);
    spacer(6);
  }

  function heading1(text) {
    spacer(4);
    writeLines(wrap(text, styles.h1), styles.h1);
    spacer(4);
  }

  function heading2(text) {
    spacer(2);
    writeLines(wrap(text, styles.h2), styles.h2);
    spacer(2);
  }

  function codeBlock(lines) {
    // light background box
    const lineHeight = styles.mono.size + styles.mono.lineGap;
    const boxPadding = 8;
    const boxHeight = lines.length * lineHeight + boxPadding * 2;
    ensureSpace(boxHeight + 6);

    const x = margin;
    const y = cursorY;
    doc.setDrawColor(220);
    doc.setFillColor(248, 248, 248);
    doc.rect(x, y, contentWidth, boxHeight, "FD");
    cursorY += boxPadding + lineHeight;

    setStyle(styles.mono);
    for (const l of lines) {
      doc.text(l, margin + boxPadding, cursorY - (styles.mono.size + styles.mono.lineGap));
      cursorY += lineHeight;
    }
    cursorY = y + boxHeight + 10;
  }

  function titleBlock(title, subtitleLines) {
    writeLines(wrap(title, styles.title), styles.title);
    spacer(2);
    for (const s of subtitleLines) {
      writeLines(wrap(s, styles.subtitle), styles.subtitle);
    }
    spacer(12);
  }

  function addPageNumbers() {
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      setStyle(styles.small);
      const label = `Page ${i} of ${pageCount}`;
      doc.text(label, pageWidth - margin, pageHeight - margin / 2, { align: "right" });
    }
  }

  return {
    paragraph,
    bullets,
    heading1,
    heading2,
    codeBlock,
    titleBlock,
    spacer,
    addPageNumbers,
  };
}

function buildReport(writer) {
  const today = fmtDate(new Date());

  writer.titleBlock("LearnHub Project Report (Beginner Friendly)", [
    "This PDF explains what the project does and how the main features work end-to-end.",
    "Repo parts covered: React frontend (this folder) and Spring Boot backend (Learnhub-backend_CS320).",
    `Generated on: ${today}`,
  ]);

  writer.heading1("1) What LearnHub Does");
  writer.paragraph(
    "LearnHub is an e-learning platform where an instructor can create and publish a course (with lectures, study materials, and quizzes). A student can register/login, browse courses, enroll for free, study the lectures/materials, take quizzes, and earn a course certificate after passing the required quiz/quizzes. Students can also book a paid 1-on-1 doubt session with the instructor."
  );
  writer.paragraph(
    "Note about the current backend: new courses are set to PUBLISHED immediately in CourseService.createCourse(), so they show up in the public catalog right after creation. The UI also includes a Publish action for future/alternate flows."
  );

  writer.heading1("2) Roles (Who Can Do What)");
  writer.bullets([
    "Student: browse courses, enroll, learn, take quizzes, view/download certificates, book sessions, rate the app.",
    "Instructor: create/edit courses, add lectures/materials, create quizzes, respond to session requests, schedule sessions.",
  ]);
  writer.paragraph(
    "Role is stored in the logged-in user data (STUDENT or INSTRUCTOR). The frontend uses this role to show the correct menu and protect pages."
  );

  writer.heading1("3) Frontend Map (Screens and Routing)");
  writer.paragraph("Main routes are defined in src/App.js. The important ones are:");
  writer.codeBlock([
    "Public:",
    "  /              -> Home",
    "  /login         -> Login",
    "  /register      -> Register",
    "  /courses       -> CourseCatalog",
    "  /courses/:id   -> CourseDetails",
    "  /certificates/verify/:certificateId -> VerifyCertificate",
    "",
    "Student (protected):",
    "  /student/dashboard",
    "  /student/my-courses",
    "  /student/learn/:courseId",
    "  /student/quiz/:quizId",
    "  /student/certificates",
    "",
    "Instructor (protected):",
    "  /instructor/dashboard",
    "  /instructor/create-course",
    "  /instructor/courses",
    "  /instructor/courses/:id/edit",
    "  /instructor/courses/:courseId/quizzes",
    "  /instructor/guide-requests",
    "  /instructor/sessions",
  ]);
  writer.paragraph(
    "Protection logic is in ProtectedRoute (inside src/App.js). If the user is not logged in, it redirects to /login. If the role is not allowed, it redirects to /."
  );

  writer.heading1("4) How Login and Register Work (Frontend + Backend)");
  writer.heading2("Frontend files");
  writer.bullets([
    "src/components/auth/Register.jsx: handleSubmit validates passwords and calls AuthContext.register()",
    "src/components/auth/Login.jsx: handleSubmit calls AuthContext.login() and redirects by role",
    "src/context/AuthContext.jsx: wraps the app, stores user in React state, exposes login/register/logout",
    "src/services/authService.js: calls backend APIs and stores token + user in localStorage",
    "src/services/api.js: Axios instance that automatically adds the token to requests",
  ]);

  writer.heading2("Backend files");
  writer.bullets([
    "Learnhub-backend_CS320/.../controller/AuthController.java: /api/auth/register and /api/auth/login",
    "Learnhub-backend_CS320/.../service/AuthService.java: creates user, checks password, generates JWT token",
    "Learnhub-backend_CS320/.../config/SecurityConfig.java: allows /api/auth/** without login, protects other routes",
    "Learnhub-backend_CS320/.../security/JwtUtil.java: creates and reads JWT (token)",
  ]);

  writer.heading2("Flow in simple steps");
  writer.bullets([
    "Register: Register.jsx -> AuthContext.register -> authService.register -> POST /api/auth/register -> AuthService.register -> returns token + user data -> saved in localStorage.",
    "Login: Login.jsx -> AuthContext.login -> authService.login -> POST /api/auth/login -> AuthService.login -> returns token + user data -> saved in localStorage.",
    "After login, api.js sends the token automatically on every request (Authorization: Bearer <token>).",
  ]);

  writer.heading1("5) Course Browsing and Course Details");
  writer.heading2("Browse course list");
  writer.bullets([
    "UI: src/components/student/CourseCatalog.jsx",
    "Main functions: fetchCourses(), fetchCategories(), filterCourses(), handleSearch(), handleCategoryChange()",
    "API calls: courseService.getAllCourses() -> GET /api/courses/public; courseService.getAllCategories() -> GET /api/categories",
  ]);
  writer.paragraph(
    "CourseCatalog loads all published courses once, then filters them in the browser (search text + category)."
  );

  writer.heading2("Open one course details page");
  writer.bullets([
    "UI: src/components/student/CourseDetails.jsx",
    "Main function: fetchCourseDetails()",
    "It loads: course (GET /api/courses/public/:id), lectures (GET /api/lectures/course/:id), materials (GET /api/materials/course/:id).",
  ]);

  writer.heading1("6) Course Enrollment (How a student registers into a course)");
  writer.heading2("Frontend");
  writer.bullets([
    "Screen: CourseDetails.jsx",
    "Button handler: handleEnroll()",
    "What it does: if not logged in -> go to /login; else POST /api/enrollments/enroll/:courseId; then navigate to /student/my-courses",
    "Student list page: src/components/student/MyCourses.jsx loads enrollments using GET /api/enrollments/my-enrollments",
  ]);

  writer.heading2("Backend");
  writer.bullets([
    "Controller: EnrollmentController.enrollInCourse (POST /api/enrollments/enroll/{courseId})",
    "Service: EnrollmentService.enrollInCourse(studentId, courseId)",
    "Rule: EnrollmentService blocks duplicate enrollment (already enrolled check).",
  ]);

  writer.heading2("Call chain (from click to database)");
  writer.codeBlock([
    "CourseDetails.handleEnroll()",
    "  -> POST /api/enrollments/enroll/{courseId}",
    "EnrollmentController.enrollInCourse()",
    "  -> EnrollmentService.enrollInCourse(studentId, courseId)",
    "    -> EnrollmentRepository.save(enrollment)",
  ]);

  writer.heading1("7) Learning a Course (Lectures, Materials, Progress)");
  writer.heading2("Frontend (Student learning screen)");
  writer.bullets([
    "Screen: src/components/student/LearnCourse.jsx",
    "Main function: fetchCourseData() loads course, lectures, materials, quizzes, and student enrollments (in parallel).",
    "Lecture selection: clicking a lecture sets currentLecture.",
    "Progress update: markProgress() calls PUT /api/enrollments/{enrollmentId}/progress with progressPercent.",
    "Quiz availability: canTakeQuiz is true when progressPercent reaches 100.",
  ]);
  writer.paragraph(
    "In this frontend, Mark as Complete increases progress by 10 each click until it reaches 100. The backend stores the number in the enrollment row."
  );

  writer.heading2("Backend (Progress update)");
  writer.bullets([
    "Controller: EnrollmentController.updateProgress (PUT /api/enrollments/{enrollmentId}/progress)",
    "Service: EnrollmentService.updateProgress(enrollmentId, progressPercent)",
  ]);

  writer.heading1("8) Quiz System (Create Quiz, Take Quiz, Submit, Pass/Fail)");
  writer.heading2("Instructor creates a quiz");
  writer.bullets([
    "UI: src/components/instructor/QuizManagement.jsx",
    "Important functions: handleCreateQuiz(), handleAddQuestion(), handleSaveQuiz(), handleDeleteQuiz()",
    "API: POST /api/quizzes (create), PUT /api/quizzes/:id (update), DELETE /api/quizzes/:id (delete), GET /api/quizzes/course/:courseId (list)",
    "Backend: QuizController + QuizService (creates Quiz and Question rows)",
  ]);

  writer.heading2("Student takes a quiz");
  writer.bullets([
    "UI: src/components/student/TakeQuiz.jsx",
    "Important functions: fetchQuiz(), handleSubmitQuiz(), submitAppRating()",
    "fetchQuiz(): GET /api/quizzes/:quizId and loads questions and timeLimit",
    "Timer: decreases timeLeft each second; auto-submits when timeLeft reaches 0",
    "Submit: POST /api/quiz-attempts/submit with quizId, answers map, timeTaken",
  ]);

  writer.heading2("Backend: how submission is checked");
  writer.bullets([
    "Controller: QuizAttemptController.submitQuizAttempt",
    "Service: QuizAttemptService.submitQuizAttempt(studentId, request)",
    "Rules checked: max attempts, calculate score by comparing student answers with correct answers",
    "If passed: tries to generate a certificate by calling CertificateService.generateCertificate(studentId, courseId)",
  ]);

  writer.heading2("Call chain (student submits quiz)");
  writer.codeBlock([
    "TakeQuiz.handleSubmitQuiz()",
    "  -> POST /api/quiz-attempts/submit { quizId, answers, timeTaken }",
    "QuizAttemptController.submitQuizAttempt()",
    "  -> QuizAttemptService.submitQuizAttempt(studentId, request)",
    "     - loads quiz + questions",
    "     - checks attempt count against quiz.maxAttempts",
    "     - calculates score and passed flag",
    "     - saves QuizAttempt (answers stored as JSON)",
    "     - if passed, calls CertificateService.generateCertificate(...)",
    "  <- returns QuizAttemptResponse (score, passed, certificateGenerated, certificateId)",
  ]);

  writer.heading2("App rating prompt (after certificate is issued)");
  writer.paragraph(
    "After a student passes and a new certificate is generated, TakeQuiz.jsx tries GET /api/app-ratings/me. If the backend returns 404 (no rating yet), the frontend opens a rating dialog and submits it to POST /api/app-ratings."
  );

  writer.heading1("9) Certificates (Generate, View, Verify, Download PDF)");
  writer.heading2("Backend certificate rules");
  writer.bullets([
    "CertificateService.generateCertificate(studentId, courseId) enforces these rules:",
    "Student must be enrolled in the course.",
    "If the course has quizzes: student must pass ALL quizzes for that course.",
    "If the course has no quizzes: progressPercent must be 100.",
  ]);

  writer.heading2("Student views and downloads certificates");
  writer.bullets([
    "UI: src/components/student/CertificateViewer.jsx",
    "Load: GET /api/certificates/my-certificates",
    "Download: handleDownloadPDF() uses html2canvas + jsPDF to save a certificate PDF (client-side).",
  ]);

  writer.heading2("Public verification page");
  writer.bullets([
    "UI: src/components/pages/VerifyCertificate.jsx",
    "API: GET /api/certificates/verify/:certificateId (this route is public in SecurityConfig)",
  ]);

  writer.heading1("10) Paid 1-on-1 Doubt Session (Book -> Pay -> Approve -> Schedule)");
  writer.heading2("Student side (frontend)");
  writer.bullets([
    "CourseDetails.jsx and LearnCourse.jsx open a dialog to enter topic/description, then open PaymentModal.",
    "PaymentModal.jsx collects payment method/details (UPI/CARD/NET_BANKING) and calls guideService.bookPaidSession().",
    "guideService.bookPaidSession() -> POST /api/guide-requests/book-session",
  ]);
  writer.paragraph(
    "Important note: payment is simulated in the backend (it can be configured to succeed or fail). This is enough for a college project/demo flow."
  );

  writer.heading2("Backend (payment + request creation)");
  writer.bullets([
    "GuideRequestController.bookPaidSession (POST /api/guide-requests/book-session)",
    "GuideRequestService.bookPaidSessionRequest: creates a GuideRequest and records a Payment linked to that request",
    "PaymentService.processGuideSessionPayment: simulates payment and saves Payment row",
  ]);

  writer.heading2("Instructor side (frontend + backend)");
  writer.bullets([
    "Frontend: src/components/instructor/GuideRequests.jsx",
    "List: guideService.getInstructorRequests() -> GET /api/guide-requests/instructor/requests",
    "Respond: guideService.respondToRequest() -> PUT /api/guide-requests/:id/respond (approve/reject)",
    "Schedule (after approval): guideService.scheduleSession() -> POST /api/guide-sessions/schedule",
    "Sessions screen: src/components/instructor/InstructorSessions.jsx (GET /api/guide-sessions/instructor/sessions)",
  ]);

  writer.heading1("11) Security (Short Explanation)");
  writer.bullets([
    "Backend uses JWT tokens. After login/register, the backend returns a token string.",
    "Frontend stores the token in localStorage and sends it with requests using src/services/api.js.",
    "Backend reads the token in JwtAuthenticationFilter and sets the user role (ROLE_STUDENT or ROLE_INSTRUCTOR).",
    "SecurityConfig allows public access to auth routes and course browsing, but requires login for enrollment, quiz attempts, sessions, etc.",
  ]);

  writer.heading1("12) Small Improvement Ideas (Optional)");
  writer.bullets([
    "Enrollment progress update: the backend updates progress by enrollmentId. Adding a check that the enrollment belongs to the logged-in student would make it safer.",
    "Frontend consistency: some screens call api directly (api.get/api.post) while others use service files (courseService/quizService). Using services everywhere keeps code more uniform.",
    "Progress logic: LearnCourse.jsx increases progress by +10 per click. A more realistic approach is to mark specific lectures as completed and compute progress from that list.",
  ]);

  writer.heading1("13) GRASP Roles (Explained with this Project)");
  writer.paragraph(
    "GRASP is a set of simple rules for giving responsibilities to the right part of the code. Below are the easiest ones to spot in LearnHub."
  );
  writer.bullets([
    "Controller: Backend controllers (AuthController, CourseController, EnrollmentController, QuizController, etc.) receive requests and delegate work to services. Frontend route pages (CourseDetails, LearnCourse, TakeQuiz) act as UI controllers for user actions.",
    "Information Expert: QuizAttemptService calculates quiz score because it has direct access to quiz + questions + student answers.",
    "Creator: Services create domain objects. Example: EnrollmentService creates Enrollment; QuizService creates Quiz and Question; CertificateService creates Certificate.",
    "Low Coupling: UI components do not know database logic. They only call the backend using services (authService/courseService/quizService/guideService).",
    "High Cohesion: Each file mostly does one job (PaymentModal only handles payment UI; MaterialUpload only handles uploads; CertificateViewer only handles certificates).",
    "Protected Variations: src/services/api.js centralizes token handling. If auth rules change later, you update one place instead of every API call.",
  ]);

  writer.heading1("14) SOLID Principles (Explained with this Project)");
  writer.paragraph(
    "SOLID is a set of design ideas that help keep code easy to change. This project shows them mainly through separation of layers and small focused files."
  );
  writer.bullets([
    "S (Single Responsibility): Backend services focus on one feature (CourseService, EnrollmentService, QuizAttemptService). Frontend has separate API service files and UI components.",
    "O (Open/Closed): Adding a new API call is usually done by adding one function to a service file (example: quizService.hasPassedQuiz) without rewriting many screens.",
    "L (Liskov Substitution): Not a big focus in this repo because there are few base classes/interfaces used directly in app code.",
    "I (Interface Segregation): Instead of one huge API file, frontend splits calls into authService/courseService/enrollmentService/quizService/guideService.",
    "D (Dependency Inversion): UI depends on small service modules (courseService, quizService) rather than calling Axios config everywhere. Backend controllers depend on services; services depend on repositories.",
  ]);

  writer.heading1("15) Key Files Cheat Sheet");
  writer.heading2("Frontend (React)");
  writer.codeBlock([
    "src/App.js",
    "src/context/AuthContext.jsx",
    "src/services/api.js",
    "src/services/authService.js",
    "src/services/courseService.js",
    "src/services/enrollmentService.js",
    "src/services/quizService.js",
    "src/services/guideService.js",
    "src/components/student/CourseCatalog.jsx",
    "src/components/student/CourseDetails.jsx",
    "src/components/student/LearnCourse.jsx",
    "src/components/student/TakeQuiz.jsx",
    "src/components/student/MyCourses.jsx",
    "src/components/student/CertificateViewer.jsx",
    "src/components/instructor/CreateCourse.jsx",
    "src/components/instructor/EditCourse.jsx",
    "src/components/instructor/QuizManagement.jsx",
    "src/components/instructor/GuideRequests.jsx",
    "src/components/instructor/InstructorSessions.jsx",
    "src/components/payment/PaymentModal.jsx",
  ]);

  writer.heading2("Backend (Spring Boot)");
  writer.codeBlock([
    "Learnhub-backend_CS320/src/main/java/com/learnhub/config/SecurityConfig.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/security/JwtAuthenticationFilter.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/security/JwtUtil.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/AuthController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/CourseController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/EnrollmentController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/QuizController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/QuizAttemptController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/CertificateController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/GuideRequestController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/controller/GuideSessionController.java",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/service/* (feature logic)",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/repository/* (database access)",
    "Learnhub-backend_CS320/src/main/java/com/learnhub/entity/* (tables/models)",
  ]);

  writer.heading1("16) One-Page Summary (For Friends)");
  writer.paragraph(
    "If you only remember one thing: LearnHub is a course platform with roles. Instructors create courses and quizzes. Students enroll for free, learn the content, take quizzes, and earn certificates. Paid 1-on-1 sessions are handled as a separate booking + simulated payment flow, then instructors approve and schedule the session."
  );
}

function main() {
  ensureDir(OUT_DIR);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const writer = createWriter(doc, { margin: 48 });

  buildReport(writer);
  writer.addPageNumbers();

  const ab = doc.output("arraybuffer");
  fs.writeFileSync(OUT_FILE, Buffer.from(ab));
  console.log(`Wrote: ${OUT_FILE}`);
}

main();
