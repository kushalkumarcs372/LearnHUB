import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Grid,
    Divider,
    Chip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import { PlayCircleOutline, Description, School, CheckCircle, Download } from '@mui/icons-material';
import { courseService } from '../../services/courseService';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../payment/PaymentModal';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isStudent } = useAuth();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [enrolled, setEnrolled] = useState(false);
    const [enrollment, setEnrollment] = useState(null);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
    const [sessionRequest, setSessionRequest] = useState({ topic: '', description: '' });
    const [sessionError, setSessionError] = useState('');
    const [error, setError] = useState('');

    const getInlineMaterialUrl = (url) => {
        if (!url) return url;
        const isBackendDownload = url.includes('/api/materials/') && url.includes('/download');
        if (!isBackendDownload) return url;
        return url.includes('?') ? `${url}&inline=true` : `${url}?inline=true`;
    };

    const fetchCourseDetails = useCallback(async () => {
        try {
            const courseRes = await courseService.getCourseById(id);
            setCourse(courseRes.data);

            const lecturesRes = await courseService.getCourseLectures(id);
            setLectures(lecturesRes.data);

            const materialsRes = await courseService.getCourseMaterials(id);
            setMaterials(materialsRes.data);

            // Check if already enrolled
            if (isAuthenticated && isStudent) {
                try {
                    const enrollmentsRes = await api.get('/enrollments/my-enrollments');
                    const myEnrollment = enrollmentsRes.data.find((e) => e.course.id === parseInt(id));
                    setEnrollment(myEnrollment || null);
                    setEnrolled(Boolean(myEnrollment));
                } catch (err) {
                    console.error('Failed to check enrollment', err);
                }
            }

            setLoading(false);
        } catch (err) {
            setError('Failed to load course details');
            setLoading(false);
        }
    }, [id, isAuthenticated, isStudent]);

    useEffect(() => {
        fetchCourseDetails();
    }, [fetchCourseDetails]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setEnrolling(true);
        try {
            await api.post(`/enrollments/enroll/${id}`);
            setEnrolled(true);
            alert('Successfully enrolled! Start learning now.');
            navigate('/student/my-courses');
        } catch (err) {
            alert(err.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const handleBookSession = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!enrollment?.id) {
            alert('Please enroll first to book a 1-on-1 session.');
            return;
        }
        setSessionError('');
        setSessionRequest({ topic: '', description: '' });
        setSessionDialogOpen(true);
    };

    const proceedToPayment = () => {
        if (!sessionRequest.topic.trim()) {
            setSessionError('Please enter a topic for the session.');
            return;
        }
        setSessionDialogOpen(false);
        setPaymentOpen(true);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>
                            {course.title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" paragraph>
                            {course.description}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                            <Chip icon={<School />} label={course.instructor?.name} />
                            {course.category && <Chip label={course.category.name} color="primary" />}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Course Content */}
                        <Typography variant="h6" gutterBottom>
                            Course Content ({lectures.length} Lectures)
                        </Typography>
                        <List>
                            {lectures.map((lecture, index) => (
                                <ListItem key={lecture.id}>
                                    <ListItemIcon>
                                        <PlayCircleOutline />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={`${index + 1}. ${lecture.title}`}
                                        secondary="Free Access"
                                    />
                                </ListItem>
                            ))}
                        </List>

                        {materials.length > 0 && (
                            <>
                                <Divider sx={{ my: 3 }} />
                                <Typography variant="h6" gutterBottom>
                                    Study Materials ({materials.length})
                                </Typography>
                                <List>
                                    {materials.map((material) => (
                                        <ListItem
                                            key={material.id}
                                            disablePadding
                                            secondaryAction={
                                                <Tooltip title="Download">
                                                    <IconButton
                                                        edge="end"
                                                        component="a"
                                                        href={material.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                    >
                                                        <Download />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        >
                                            <ListItemButton
                                                component="a"
                                                href={getInlineMaterialUrl(material.fileUrl)}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <ListItemIcon>
                                                    <Description />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={material.title}
                                                    secondary={material.fileType}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 20 }}>
                            <Typography variant="h5" gutterBottom align="center">
                                FREE Course
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph align="center">
                                Access all content for free!
                            </Typography>

                            {enrolled ? (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="success"
                                    size="large"
                                    startIcon={<CheckCircle />}
                                    onClick={() => navigate('/student/my-courses')}
                                >
                                    Go to My Courses
                                </Button>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                >
                                    {enrolling ? 'Enrolling...' : 'Enroll Now (Free)'}
                                </Button>
                            )}

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" gutterBottom>
                                1-on-1 Doubt Session
                            </Typography>
                            <Typography variant="body2" paragraph>
                                Book a personal session with the instructor to clarify doubts. Course content, quiz, and certificate are free.
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircle color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="1-on-1 Sessions" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircle color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Doubt Clarification" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon>
                                        <CheckCircle color="primary" fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText primary="Project Guidance" />
                                </ListItem>
                            </List>
                            <Typography variant="caption" color="text.secondary">
                                Available after enrollment
                            </Typography>

                            <Button
                                fullWidth
                                sx={{ mt: 2 }}
                                variant="contained"
                                disabled={!enrolled}
                                onClick={handleBookSession}
                            >
                                Book Session (₹999)
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog open={sessionDialogOpen} onClose={() => setSessionDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Book 1-on-1 Doubt Session</DialogTitle>
                <DialogContent>
                    {sessionError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {sessionError}
                        </Alert>
                    )}
                    <TextField
                        fullWidth
                        label="Topic"
                        value={sessionRequest.topic}
                        onChange={(e) => setSessionRequest({ ...sessionRequest, topic: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description (optional)"
                        value={sessionRequest.description}
                        onChange={(e) => setSessionRequest({ ...sessionRequest, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                        placeholder="Explain what you want to clarify..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSessionDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={proceedToPayment}>
                        Continue to Payment
                    </Button>
                </DialogActions>
            </Dialog>

            <PaymentModal
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                courseId={course?.id}
                instructorId={course?.instructor?.id}
                topic={sessionRequest.topic}
                description={sessionRequest.description}
                amount={999}
                onSuccess={fetchCourseDetails}
            />
        </Container>
    );
};

export default CourseDetails;
