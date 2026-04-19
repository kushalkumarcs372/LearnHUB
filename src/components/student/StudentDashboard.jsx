import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    LinearProgress,
    Avatar,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import {
    School,
    LibraryBooks,
    EmojiEvents,
    TrendingUp,
    ArrowForward,
    LocalFireDepartment,
    Timer,
} from '@mui/icons-material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();
    const [stats, setStats] = useState({
        totalEnrollments: 0,
        completedCourses: 0,
        inProgress: 0,
        certificates: 0,
        totalHours: 0,
        streak: 0,
    });
    const [recentEnrollments, setRecentEnrollments] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const enrollmentsRes = await api.get('/enrollments/my-enrollments');
            const enrollments = enrollmentsRes.data;

            const certsRes = await api.get('/certificates/my-certificates');
            const certs = certsRes.data;

            setStats({
                totalEnrollments: enrollments.length,
                completedCourses: enrollments.filter((e) => e.progressPercent === 100).length,
                inProgress: enrollments.filter((e) => e.progressPercent > 0 && e.progressPercent < 100).length,
                certificates: certs.length,
                totalHours: enrollments.length * 12, // Mock data
                streak: 7, // Mock data
            });

            setRecentEnrollments(enrollments.slice(0, 3));
        } catch (err) {
            console.error('Failed to load dashboard data', err);
        }
    };

    const StatCard = ({ icon, title, value, color, subtitle, gradient }) => (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
        >
            <Paper
                sx={{
                    p: 3,
                    height: '100%',
                    background: gradient || `linear-gradient(135deg, ${color}15 0%, ${color}30 100%)`,
                    border: `2px solid ${color}30`,
                    borderRadius: 3,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 100,
                        height: 100,
                        borderRadius: '50%',
                        background: `${color}20`,
                        filter: 'blur(30px)',
                    }}
                />
                <Box sx={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h3" fontWeight="bold" sx={{ color, mb: 0.5 }}>
                            {value}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" color="text.secondary">
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                    <Avatar
                        sx={{
                            bgcolor: `${color}20`,
                            color: color,
                            width: 56,
                            height: 56,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
            </Paper>
        </motion.div>
    );

    return (
        <>
            <Box
                sx={{
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                    py: 6,
                }}
            >
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Welcome back, {user?.name}! 👋
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            Ready to continue your learning journey?
                        </Typography>
                    </motion.div>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, mb: 6 }}>
                {/* Stats Grid */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<School sx={{ fontSize: 28 }} />}
                            title="Total Courses"
                            value={stats.totalEnrollments}
                            color={theme.palette.primary.main}
                            subtitle="Enrolled"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<TrendingUp sx={{ fontSize: 28 }} />}
                            title="In Progress"
                            value={stats.inProgress}
                            color={theme.palette.warning.main}
                            subtitle="Keep going!"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<LibraryBooks sx={{ fontSize: 28 }} />}
                            title="Completed"
                            value={stats.completedCourses}
                            color={theme.palette.success.main}
                            subtitle="Courses finished"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={<EmojiEvents sx={{ fontSize: 28 }} />}
                            title="Certificates"
                            value={stats.certificates}
                            color={theme.palette.secondary.main}
                            subtitle="Earned"
                        />
                    </Grid>
                </Grid>

                {/* Activity Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Paper
                                sx={{
                                    p: 3,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.12)} 0%, ${alpha(theme.palette.error.main, 0.22)} 100%)`,
                                    border: `2px solid ${alpha(theme.palette.error.main, 0.22)}`,
                                    borderRadius: 3,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: theme.palette.error.main, width: 48, height: 48 }}>
                                        <LocalFireDepartment />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold" color={theme.palette.error.main}>
                                            {stats.streak} Days
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Learning Streak 🔥
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    You're on fire! Keep up the great work.
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Paper
                                sx={{
                                    p: 3,
                                    background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.12)} 0%, ${alpha(theme.palette.info.main, 0.22)} 100%)`,
                                    border: `2px solid ${alpha(theme.palette.info.main, 0.22)}`,
                                    borderRadius: 3,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Avatar sx={{ bgcolor: theme.palette.info.main, width: 48, height: 48 }}>
                                        <Timer />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold" color={theme.palette.info.main}>
                                            {stats.totalHours}h
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Total Learning Time ⏱️
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                    That's {Math.floor(stats.totalHours / 24)} days of dedication!
                                </Typography>
                            </Paper>
                        </motion.div>
                    </Grid>
                </Grid>

                {/* Continue Learning Section */}
                <Box sx={{ mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" fontWeight="bold">
                            Continue Learning
                        </Typography>
                        <Button
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/student/my-courses')}
                        >
                            View All
                        </Button>
                    </Box>

                    {recentEnrollments.length === 0 ? (
                        <Paper
                            sx={{
                                p: 6,
                                textAlign: 'center',
                                borderRadius: 3,
                                background: (theme) =>
                                    `linear-gradient(135deg, ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'} 0%, ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(102,126,234,0.14)'} 100%)`,
                            }}
                        >
                            <School sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.55 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No courses enrolled yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Start your learning journey today!
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/courses')}
                                sx={{
                                    background: (theme) => theme.custom?.gradients?.primary,
                                    px: 4,
                                }}
                            >
                                Explore Courses
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={3}>
                            {recentEnrollments.map((enrollment, index) => (
                                <Grid item xs={12} md={4} key={enrollment.id}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.03 }}
                                    >
                                        <Card
                                            sx={{
                                                height: '100%',
                                                cursor: 'pointer',
                                                borderRadius: 3,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                                transition:
                                                    'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                                                '&:hover': {
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: (theme) => theme.custom?.shadows?.cardHover,
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                            onClick={() => navigate(`/student/learn/${enrollment.course.id}`)}
                                        >
                                            <Box
                                                sx={{
                                                    height: 120,
                                                    background: (theme) => theme.custom?.gradients?.primary,
                                                    position: 'relative',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -20,
                                                        right: -20,
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: '50%',
                                                        background: 'rgba(255,255,255,0.2)',
                                                        filter: 'blur(20px)',
                                                    }}
                                                />
                                            </Box>
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    gutterBottom
                                                    noWrap
                                                    title={enrollment.course.title}
                                                >
                                                    {enrollment.course.title}
                                                </Typography>
                                                <Box sx={{ mb: 2 }}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Progress
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold" color="primary">
                                                            {enrollment.progressPercent}%
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={enrollment.progressPercent}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 4,
                                                            bgcolor: (theme) =>
                                                                theme.palette.mode === 'dark'
                                                                    ? 'rgba(255,255,255,0.08)'
                                                                    : 'rgba(102,126,234,0.18)',
                                                            '& .MuiLinearProgress-bar': {
                                                                background: (theme) => theme.custom?.gradients?.primary,
                                                                borderRadius: 4,
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/student/learn/${enrollment.course.id}`);
                                                    }}
                                                    sx={{
                                                        background: (theme) => theme.custom?.gradients?.primary,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    Continue Learning
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>

                {/* Quick Actions */}
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Quick Actions
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<School />}
                                onClick={() => navigate('/courses')}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                Browse Courses
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<LibraryBooks />}
                                onClick={() => navigate('/student/my-courses')}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                My Courses
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<EmojiEvents />}
                                onClick={() => navigate('/student/certificates')}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                Certificates
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<TrendingUp />}
                                onClick={() => navigate('/student/progress')}
                                sx={{ py: 1.5, borderRadius: 2 }}
                            >
                                View Progress
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};

export default StudentDashboard;
