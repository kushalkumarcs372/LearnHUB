import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    Container,
    Grid,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import {
    Add,
    CheckCircle,
    PendingActions,
    People,
    Quiz,
    School,
    SupportAgent,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { courseService } from '../../services/courseService';
import { guideService } from '../../services/guideService';
import { useAuth } from '../../context/AuthContext';

const MotionPaper = motion.create(Paper);

const InstructorDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [stats, setStats] = useState({
        totalCourses: 0,
        publishedCourses: 0,
        totalStudents: 0,
        pendingRequests: 0,
    });
    const [courses, setCourses] = useState([]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const coursesRes = await courseService.getMyCourses();
            const myCourses = coursesRes.data || [];

            const pendingRes = await guideService.getPendingCount();

            let totalStudents = 0;
            await Promise.all(
                myCourses.map(async (course) => {
                    try {
                        const enrollmentsRes = await courseService.getCourseEnrollments(course.id);
                        totalStudents += (enrollmentsRes.data || []).length;
                    } catch {
                        // ignore per-course failures
                    }
                })
            );

            setStats({
                totalCourses: myCourses.length,
                publishedCourses: myCourses.filter((c) => c.status === 'PUBLISHED').length,
                totalStudents,
                pendingRequests: pendingRes.data ?? 0,
            });
            setCourses(myCourses.slice(0, 6));
        } catch (err) {
            console.error('Failed to load instructor dashboard', err);
            setLoadError(err?.response?.data?.message || 'Failed to load dashboard data. Please try again.');
            setStats({
                totalCourses: 0,
                publishedCourses: 0,
                totalStudents: 0,
                pendingRequests: 0,
            });
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const statCards = useMemo(
        () => [
            {
                title: 'Total Courses',
                value: stats.totalCourses,
                icon: <School />,
                accent: theme.palette.primary.main,
            },
            {
                title: 'Published',
                value: stats.publishedCourses,
                icon: <CheckCircle />,
                accent: theme.palette.success.main,
            },
            {
                title: 'Total Students',
                value: stats.totalStudents,
                icon: <People />,
                accent: theme.palette.info.main,
            },
            {
                title: 'Pending Requests',
                value: stats.pendingRequests,
                icon: <PendingActions />,
                accent: theme.palette.warning.main,
            },
        ],
        [stats, theme]
    );

    return (
        <Box>
            {/* Header */}
            <Box
                sx={{
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                    py: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box>
                            <Typography variant="h3" fontWeight={900} gutterBottom>
                                Instructor Dashboard
                            </Typography>
                            <Typography sx={{ opacity: 0.92 }}>
                                Welcome back{user?.name ? `, ${user.name}` : ''}. Build, publish, and guide learners.
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate('/instructor/create-course')}
                            sx={{
                                bgcolor: 'rgba(255,255,255,0.14)',
                                backgroundImage: 'none',
                                border: '1px solid rgba(255,255,255,0.25)',
                                '&:hover': { bgcolor: 'rgba(255,255,255,0.20)', backgroundImage: 'none' },
                            }}
                        >
                            Create Course
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -3, pb: 6 }}>
                {loadError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {loadError}
                    </Alert>
                )}
                {/* Stats */}
                <Grid container spacing={2}>
                    {loading
                        ? statCards.map((card) => (
                              <Grid item xs={12} sm={6} md={3} key={card.title}>
                                  <Paper sx={{ p: 2.5, borderRadius: 4 }}>
                                      <Skeleton variant="text" width="60%" height={26} />
                                      <Skeleton variant="text" width="40%" height={42} />
                                  </Paper>
                              </Grid>
                          ))
                        : statCards.map((card) => (
                              <Grid item xs={12} sm={6} md={3} key={card.title}>
                                  <MotionPaper
                                      whileHover={{ y: -4, scale: 1.01 }}
                                      transition={{ duration: 0.18 }}
                                      sx={{
                                          p: 2.5,
                                          borderRadius: 4,
                                          position: 'relative',
                                          overflow: 'hidden',
                                          borderColor: `${card.accent}33`,
                                      }}
                                  >
                                      <Box
                                          sx={{
                                              position: 'absolute',
                                              top: -30,
                                              right: -30,
                                              width: 120,
                                              height: 120,
                                              borderRadius: '50%',
                                              bgcolor: `${card.accent}22`,
                                              filter: 'blur(18px)',
                                          }}
                                      />
                                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                          <Box>
                                              <Typography variant="body2" color="text.secondary">
                                                  {card.title}
                                              </Typography>
                                              <Typography variant="h4" fontWeight={900} sx={{ color: card.accent, mt: 0.5 }}>
                                                  {card.value}
                                              </Typography>
                                          </Box>
                                          <Box
                                              sx={{
                                                  width: 44,
                                                  height: 44,
                                                  display: 'grid',
                                                  placeItems: 'center',
                                                  borderRadius: 3,
                                                  bgcolor: `${card.accent}22`,
                                                  color: card.accent,
                                              }}
                                          >
                                              {card.icon}
                                          </Box>
                                      </Box>
                                  </MotionPaper>
                              </Grid>
                          ))}
                </Grid>

                {/* Courses */}
                <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Typography variant="h6" fontWeight={900}>
                            Recent Courses
                        </Typography>
                        <Button onClick={() => navigate('/instructor/courses')}>View all</Button>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, idx) => (
                                <Grid item xs={12} md={4} key={idx}>
                                    <Card>
                                        <CardContent>
                                            <Skeleton variant="text" width="75%" height={30} />
                                            <Skeleton variant="text" width="55%" />
                                            <Skeleton variant="rounded" height={36} sx={{ mt: 2 }} />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))
                        ) : courses.length === 0 ? (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 5 }}>
                                    <Typography variant="h6" color="text.secondary" fontWeight={800} gutterBottom>
                                        No courses yet
                                    </Typography>
                                    <Typography color="text.secondary">
                                        Create your first course and start teaching.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        sx={{ mt: 2 }}
                                        onClick={() => navigate('/instructor/create-course')}
                                    >
                                        Create Course
                                    </Button>
                                </Box>
                            </Grid>
                        ) : (
                            courses.map((course) => (
                                <Grid item xs={12} md={4} key={course.id}>
                                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle1" fontWeight={900} gutterBottom noWrap>
                                                {course.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                {course.description ? `${course.description.slice(0, 100)}…` : 'No description yet.'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                <Chip label={course.status || 'DRAFT'} size="small" />
                                                {course.category?.name && (
                                                    <Chip label={course.category.name} variant="outlined" size="small" />
                                                )}
                                            </Box>
                                        </CardContent>
                                        <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                                            >
                                                Manage
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<Quiz />}
                                                onClick={() => navigate(`/instructor/courses/${course.id}/quizzes`)}
                                            >
                                                Quizzes
                                            </Button>
                                            <Box sx={{ flexGrow: 1 }} />
                                            <Button
                                                size="small"
                                                startIcon={<SupportAgent />}
                                                onClick={() => navigate('/instructor/guide-requests')}
                                            >
                                                Requests
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        )}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default InstructorDashboard;
