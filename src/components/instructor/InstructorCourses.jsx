import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Chip,
    Box,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    Paper,  // ADD THIS
} from '@mui/material';
import { Add, MoreVert, Edit, Delete, Publish } from '@mui/icons-material';
import { courseService } from '../../services/courseService';

const InstructorCourses = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await courseService.getMyCourses();
            setCourses(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load courses');
            setLoading(false);
        }
    };

    const handleMenuOpen = (event, course) => {
        setAnchorEl(event.currentTarget);
        setSelectedCourse(course);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCourse(null);
    };

    const handlePublish = async (courseId) => {
        try {
            await courseService.publishCourse(courseId);
            alert('Course published successfully!');
            fetchCourses();
        } catch (err) {
            alert('Failed to publish course');
        }
        handleMenuClose();
    };

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseService.deleteCourse(courseId);
                alert('Course deleted successfully');
                fetchCourses();
            } catch (err) {
                alert('Failed to delete course');
            }
        }
        handleMenuClose();
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    My Courses
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => navigate('/instructor/create-course')}
                >
                    Create Course
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {courses.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No courses created yet
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate('/instructor/create-course')}
                        sx={{ mt: 2 }}
                    >
                        Create Your First Course
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {courses.map((course) => (
                        <Grid item xs={12} md={6} lg={4} key={course.id}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                            {course.title}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => handleMenuOpen(e, course)}
                                        >
                                            <MoreVert />
                                        </IconButton>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        {course.description?.substring(0, 100)}...
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <Chip
                                            label={course.status}
                                            color={course.status === 'PUBLISHED' ? 'success' : 'default'}
                                            size="small"
                                        />
                                        {course.category && (
                                            <Chip
                                                label={course.category.name}
                                                variant="outlined"
                                                size="small"
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => navigate(`/instructor/courses/${course.id}/edit`)}
                                    >
                                        Manage
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    navigate(`/instructor/courses/${selectedCourse?.id}/edit`);
                    handleMenuClose();
                }}>
                    <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
                </MenuItem>
                {selectedCourse?.status === 'DRAFT' && (
                    <MenuItem onClick={() => handlePublish(selectedCourse?.id)}>
                        <Publish fontSize="small" sx={{ mr: 1 }} /> Publish
                    </MenuItem>
                )}
                <MenuItem onClick={() => handleDelete(selectedCourse?.id)}>
                    <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </Container>
    );
};

export default InstructorCourses;
