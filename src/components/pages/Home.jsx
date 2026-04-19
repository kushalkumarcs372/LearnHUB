import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    alpha,
} from '@mui/material';
import {
    School,
    People,
    EmojiEvents,
    TrendingUp,
    Star,
    ArrowForward,
    MenuBook,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import GradientText from '../common/GradientText';
import { courseService } from '../../services/courseService';
import api from '../../services/api';

const EnhancedHome = () => {
    const navigate = useNavigate();
    const { isAuthenticated, isStudent, isInstructor } = useAuth();
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [recentRatings, setRecentRatings] = useState([]);
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalInstructors: 0,
        totalEnrollments: 0,
        totalLogins: 0,
        averageRating: 0,
        ratingCount: 0,
    });

    useEffect(() => {
        if (isAuthenticated) {
            if (isStudent) navigate('/student/dashboard');
            else if (isInstructor) navigate('/instructor/dashboard');
        }
        fetchHomeData();
    }, [isAuthenticated, isStudent, isInstructor, navigate]);

    const fetchHomeData = async () => {
        try {
            const [coursesRes, statsRes] = await Promise.all([
                courseService.getAllCourses(),
                api.get('/public/stats'),
            ]);

            const courses = coursesRes?.data ?? [];
            setFeaturedCourses(courses.slice(0, 3));

            const s = statsRes?.data;
            setStats({
                totalCourses: s?.totalCourses ?? courses.length,
                totalStudents: s?.totalStudents ?? 0,
                totalInstructors: s?.totalInstructors ?? 0,
                totalEnrollments: s?.totalEnrollments ?? 0,
                totalLogins: s?.totalLogins ?? 0,
                averageRating: s?.averageRating ?? 0,
                ratingCount: s?.ratingCount ?? 0,
            });

            try {
                const recentRes = await api.get('/public/ratings/recent?limit=3');
                setRecentRatings(recentRes?.data ?? []);
            } catch (e) {
                setRecentRatings([]);
            }
        } catch (err) {
            console.error('Failed to load courses', err);
        }
    };

    const features = [
        {
            icon: <School sx={{ fontSize: 50 }} />,
            title: 'Free Courses',
            description: 'Access high-quality courses completely free. Learn at your own pace.',
            color: '#6366f1',
        },
        {
            icon: <People sx={{ fontSize: 50 }} />,
            title: 'Expert Instructors',
            description: 'Learn from experienced instructors passionate about teaching.',
            color: '#ec4899',
        },
        {
            icon: <TrendingUp sx={{ fontSize: 50 }} />,
            title: 'Track Progress',
            description: 'Monitor your learning journey with detailed progress tracking.',
            color: '#10b981',
        },
        {
            icon: <EmojiEvents sx={{ fontSize: 50 }} />,
            title: 'Earn Certificates',
            description: 'Get certified upon course completion to showcase your skills.',
            color: '#f59e0b',
        },
    ];

    const testimonials = useMemo(() => {
        if ((recentRatings || []).length > 0) {
            return recentRatings.map((r) => ({
                name: r.name || 'User',
                role: 'LearnHub Student',
                avatar: (r.name || 'U').charAt(0).toUpperCase(),
                rating: r.rating || 5,
                text: r.comment || 'Great experience!',
            }));
        }
        return [
            {
                name: 'Sarah Johnson',
                role: 'Web Developer',
                avatar: 'S',
                rating: 5,
                text: 'LearnHub transformed my career! The courses are excellent and the instructors are so helpful.',
            },
            {
                name: 'Michael Chen',
                role: 'Data Scientist',
                avatar: 'M',
                rating: 5,
                text: 'Best learning platform I\'ve ever used. The 1-on-1 doubt sessions are a game-changer!',
            },
            {
                name: 'Emily Davis',
                role: 'UI/UX Designer',
                avatar: 'E',
                rating: 5,
                text: 'Amazing platform with great content. I completed 5 courses and got my dream job!',
            },
        ];
    }, [recentRatings]);

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    py: { xs: 8, md: 15 },
                }}
            >
                {/* Animated Background Circles */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        filter: 'blur(60px)',
                        animation: 'float 6s ease-in-out infinite',
                        '@keyframes float': {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-30px)' },
                        },
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -100,
                        left: -100,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        filter: 'blur(60px)',
                        animation: 'float 8s ease-in-out infinite',
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '2.5rem', md: '4rem' },
                                        fontWeight: 800,
                                        mb: 2,
                                        textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    Learn Without Limits
                                </Typography>
                                <Typography
                                    variant="h5"
                                    sx={{
                                        mb: 3,
                                        opacity: 0.95,
                                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                                    }}
                                >
                                    Access {stats.totalCourses}+ courses FREE. Pay only for 1-on-1 doubt sessions.
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 4,
                                        opacity: 0.9,
                                        fontSize: '1.1rem',
                                        lineHeight: 1.8,
                                    }}
                                >
                                    Join {stats.totalStudents.toLocaleString()} students learning from {stats.totalInstructors.toLocaleString()} instructors.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => navigate('/courses')}
                                        endIcon={<ArrowForward />}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.96)',
                                            color: 'primary.main',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            boxShadow: (theme) =>
                                                theme.palette.mode === 'dark'
                                                    ? '0 16px 44px rgba(0,0,0,0.55)'
                                                    : '0 10px 30px rgba(0,0,0,0.20)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255,255,255,0.95)',
                                                transform: 'translateY(-4px)',
                                                boxShadow: (theme) =>
                                                    theme.palette.mode === 'dark'
                                                        ? '0 22px 64px rgba(0,0,0,0.65)'
                                                        : '0 15px 40px rgba(0,0,0,0.30)',
                                            },
                                            transition:
                                                'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        Explore Courses
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/register')}
                                        sx={{
                                            borderColor: 'white',
                                            color: 'white',
                                            px: 4,
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            fontWeight: 700,
                                            borderWidth: 2,
                                            '&:hover': {
                                                borderWidth: 2,
                                                bgcolor: 'rgba(255,255,255,0.15)',
                                                transform: 'translateY(-4px)',
                                            },
                                            transition:
                                                'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    >
                                        Get Started Free
                                    </Button>
                                </Box>
                            </motion.div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
                                    alt="Students learning"
                                    sx={{
                                        width: '100%',
                                        borderRadius: 4,
                                        boxShadow: (theme) =>
                                            theme.palette.mode === 'dark'
                                                ? '0 22px 70px rgba(0,0,0,0.65)'
                                                : '0 20px 60px rgba(0,0,0,0.30)',
                                        transform: 'perspective(1000px) rotateY(-5deg)',
                                    }}
                                />
                            </motion.div>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Container maxWidth="lg" sx={{ mt: -6, position: 'relative', zIndex: 20 }}>
                <Grid container spacing={3}>
                    {[
                        { value: stats.totalCourses.toLocaleString(), label: 'Courses', icon: <MenuBook /> },
                        { value: (stats.totalStudents + stats.totalInstructors).toLocaleString(), label: 'Users', icon: <People /> },
                        { value: stats.totalLogins.toLocaleString(), label: 'Logins', icon: <TrendingUp /> },
                        {
                            value: stats.ratingCount > 0 ? `${stats.averageRating.toFixed(1)}/5` : '—',
                            label: stats.ratingCount > 0 ? `Rating (${stats.ratingCount})` : 'Rating',
                            icon: <Star />,
                        },
                    ].map((stat, index) => (
                        <Grid item xs={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card
                                    sx={{
                                        textAlign: 'center',
                                        p: 3,
                                        background: 'background.paper',
                                        boxShadow: (theme) => theme.custom?.shadows?.card,
                                        borderRadius: 3,
                                    }}
                                >
                                    <Box sx={{ color: 'primary.main', mb: 1 }}>{stat.icon}</Box>
                                    <Typography variant="h3" fontWeight="bold" color="primary">
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.label}
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <GradientText variant="h2" gradient="primary">
                            Why Choose LearnHub?
                        </GradientText>
                        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                            Everything you need to succeed in your learning journey
                        </Typography>
                    </motion.div>
                </Box>

                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                            >
                                 <Card
                                     sx={{
                                         height: '100%',
                                         textAlign: 'center',
                                         p: 4,
                                         background: `linear-gradient(135deg, ${alpha(feature.color, 0.1)} 0%, ${alpha(feature.color, 0.05)} 100%)`,
                                         border: `2px solid ${alpha(feature.color, 0.2)}`,
                                         transition:
                                             'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                                         '&:hover': {
                                             boxShadow: `0 20px 40px ${alpha(feature.color, 0.2)}`,
                                             border: `2px solid ${feature.color}`,
                                         },
                                     }}
                                 >
                                    <Box sx={{ color: feature.color, mb: 2 }}>{feature.icon}</Box>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

              {/* Featured Courses */}
              {featuredCourses.length > 0 && (
                <Box sx={{ bgcolor: (theme) => (theme.palette.mode === 'dark' ? alpha('#ffffff', 0.04) : '#f8fafc'), py: 10 }}>
                      <Container maxWidth="lg">
                          <Box sx={{ textAlign: 'center', mb: 6 }}>
                            <GradientText variant="h2" gradient="secondary">
                                Featured Courses
                            </GradientText>
                            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                                Start learning with our most popular courses
                            </Typography>
                        </Box>

                        <Grid container spacing={4}>
                            {featuredCourses.map((course, index) => (
                                <Grid item xs={12} md={4} key={course.id}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                         <Card
                                             sx={{
                                                 cursor: 'pointer',
                                                 height: '100%',
                                                 transition:
                                                     'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                                                 '&:hover': {
                                                     boxShadow: (theme) => theme.custom?.shadows?.cardHover,
                                                 },
                                             }}
                                             onClick={() => navigate(`/courses/${course.id}`)}
                                         >
                                            <Box
                                                sx={{
                                                    height: 200,
                                                    background: `url(https://source.unsplash.com/800x400/?${course.category?.name || 'education'})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    position: 'relative',
                                                }}
                                            >
                                                <Chip
                                                    label="FREE"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 16,
                                                        right: 16,
                                                        bgcolor: 'success.main',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                            </Box>
                                            <CardContent>
                                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                    {course.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary" paragraph>
                                                    {course.description?.substring(0, 100)}...
                                                </Typography>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                                        {course.instructor?.name?.charAt(0)}
                                                    </Avatar>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {course.instructor?.name}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/courses')}
                                endIcon={<ArrowForward />}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    background: (theme) => theme.custom?.gradients?.primary,
                                }}
                            >
                                View All Courses
                            </Button>
                        </Box>
                    </Container>
                </Box>
            )}

            {/* Testimonials */}
            <Container maxWidth="lg" sx={{ py: 10 }}>
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <GradientText variant="h2" gradient="gold">
                        What Our Students Say
                    </GradientText>
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                        Join thousands of satisfied learners
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Card sx={{ p: 3, height: '100%' }}>
                                    <Box sx={{ display: 'flex', mb: 2 }}>
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} sx={{ color: '#fbbf24', fontSize: 20 }} />
                                        ))}
                                    </Box>
                                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                                        "{testimonial.text}"
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 'auto' }}>
                                        <Avatar sx={{ bgcolor: 'primary.main' }}>{testimonial.avatar}</Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {testimonial.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* CTA Section */}
            <Box
                sx={{
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                    py: 10,
                }}
            >
                <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Typography variant="h2" fontWeight="bold" gutterBottom>
                            Ready to Start Learning?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.95 }}>
                            Join thousands of learners improving their skills every day
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/register')}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.96)',
                                    color: 'primary.main',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.95)',
                                    },
                                }}
                            >
                                Sign Up Free
                            </Button>
                            <Button
                                variant="outlined"
                                size="large"
                                onClick={() => navigate('/courses')}
                                sx={{
                                    borderColor: 'white',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 700,
                                    borderWidth: 2,
                                    '&:hover': {
                                        borderWidth: 2,
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                    },
                                }}
                            >
                                Browse Courses
                            </Button>
                        </Box>
                    </motion.div>
                </Container>
            </Box>
        </>
    );
};

export default EnhancedHome;
