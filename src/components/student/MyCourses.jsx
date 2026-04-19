import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    LinearProgress,
    Box,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import { School } from '@mui/icons-material';
import api from '../../services/api';

const MyCourses = () => {
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await api.get('/enrollments/my-enrollments');
            setEnrollments(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load your courses');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Enrolled Courses
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {enrollments.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <School sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No courses enrolled yet
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/courses')}
                        sx={{ mt: 2 }}
                    >
                        Browse Courses
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {enrollments.map((enrollment) => (
                        <Grid item xs={12} md={6} key={enrollment.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {enrollment.course.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {enrollment.course.description?.substring(0, 100)}...
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="body2">Progress</Typography>
                                            <Typography variant="body2">{enrollment.progressPercent}%</Typography>
                                        </Box>
                                        <LinearProgress
                                            variant="determinate"
                                            value={enrollment.progressPercent}
                                            sx={{ height: 8, borderRadius: 4 }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => navigate(`/student/learn/${enrollment.course.id}`)}
                                        >
                                            Continue Learning
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyCourses;
