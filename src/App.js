import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { ThemeModeProvider } from './context/ThemeModeContext';

import AnimatedPage from './components/common/AnimatedPage';
import ScrollToTop from './components/common/ScrollToTop';


// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Auth
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';

// Public
import Home from './components/pages/Home';
import CourseCatalog from './components/student/CourseCatalog';
import CourseDetails from './components/student/CourseDetails';

// Student
import StudentDashboard from './components/student/StudentDashboard';
import MyCourses from './components/student/MyCourses';
import LearnCourse from './components/student/LearnCourse';
import TakeQuiz from './components/student/TakeQuiz';
import CertificateViewer from './components/student/CertificateViewer';
import ProgressAnalytics from './components/student/ProgressAnalytics';

// Instructor
import InstructorDashboard from './components/instructor/InstructorDashboard';
import CreateCourse from './components/instructor/CreateCourse';
import EditCourse from './components/instructor/EditCourse';
import InstructorCourses from './components/instructor/InstructorCourses';
import GuideRequests from './components/instructor/GuideRequests';
import QuizManagement from './components/instructor/QuizManagement';
import InstructorSessions from './components/instructor/InstructorSessions';

// Pages
import NotFound from './components/pages/NotFound';
import VerifyCertificate from './components/pages/VerifyCertificate';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" />;
    return children;
};

const withPageTransition = (element) => <AnimatedPage>{element}</AnimatedPage>;

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public */}
                <Route path="/" element={withPageTransition(<Home />)} />
                <Route path="/login" element={withPageTransition(<Login />)} />
                <Route path="/register" element={withPageTransition(<Register />)} />
                <Route path="/forgot-password" element={withPageTransition(<ForgotPassword />)} />
                <Route path="/courses" element={withPageTransition(<CourseCatalog />)} />
                <Route path="/courses/:id" element={withPageTransition(<CourseDetails />)} />
                <Route path="/certificates/verify/:certificateId" element={withPageTransition(<VerifyCertificate />)} />

                {/* Student */}
                <Route
                    path="/student/dashboard"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/student/my-courses"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <MyCourses />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/student/learn/:courseId"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <LearnCourse />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/student/quiz/:quizId"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <TakeQuiz />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/student/certificates"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <CertificateViewer />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/student/progress"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['STUDENT']}>
                            <ProgressAnalytics />
                        </ProtectedRoute>
                    )}
                />

                {/* Instructor */}
                <Route
                    path="/instructor/dashboard"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <InstructorDashboard />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/instructor/create-course"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <CreateCourse />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/instructor/courses"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <InstructorCourses />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/instructor/courses/:id/edit"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <EditCourse />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/instructor/courses/:courseId/quizzes"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <QuizManagement />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/instructor/guide-requests"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <GuideRequests />
                        </ProtectedRoute>
                    )}
                />
                <Route
                    path="/instructor/sessions"
                    element={withPageTransition(
                        <ProtectedRoute allowedRoles={['INSTRUCTOR']}>
                            <InstructorSessions />
                        </ProtectedRoute>
                    )}
                />

                <Route path="/404" element={withPageTransition(<NotFound />)} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <ThemeModeProvider>
            <Router>
                <AuthProvider>
                    <ScrollToTop />
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Navbar />
                        <Box component="main" sx={{ flexGrow: 1 }}>
                            <AnimatedRoutes />
                        </Box>
                        <Footer />
                    </Box>
                </AuthProvider>
            </Router>
        </ThemeModeProvider>
    );
}

export default App;
