import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Button,
    LinearProgress,
    Chip,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    PlayCircle,
    CheckCircle,
    Description,
    ContactSupport,
    Download,
    Quiz,
} from '@mui/icons-material';
import { courseService } from '../../services/courseService';
import api from '../../services/api';
import PaymentModal from '../payment/PaymentModal';
import { quizService } from '../../services/quizService';

const LearnCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [lectures, setLectures] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [quizPassed, setQuizPassed] = useState({}); // quizId -> boolean
    const [enrollment, setEnrollment] = useState(null);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [guideDialogOpen, setGuideDialogOpen] = useState(false);
    const [guideRequest, setGuideRequest] = useState({ topic: '', description: '' });
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [error, setError] = useState('');
    const canTakeQuiz = (enrollment?.progressPercent ?? 0) >= 100;

    const getInlineMaterialUrl = (url) => {
        if (!url) return url;
        const isBackendDownload = url.includes('/api/materials/') && url.includes('/download');
        if (!isBackendDownload) return url;
        return url.includes('?') ? `${url}&inline=true` : `${url}?inline=true`;
    };

    const fetchCourseData = useCallback(async () => {
        try {
            setError('');
            const [courseRes, lecturesRes, materialsRes, quizzesRes, enrollmentsRes] = await Promise.all([
                courseService.getCourseById(courseId),
                courseService.getCourseLectures(courseId),
                courseService.getCourseMaterials(courseId),
                quizService.getCourseQuizzes(courseId),
                api.get('/enrollments/my-enrollments'),
            ]);

            setCourse(courseRes.data);
            setLectures(lecturesRes.data);
            setMaterials(materialsRes.data);
            setQuizzes(quizzesRes.data || []);

            const myEnrollment = enrollmentsRes.data.find(
                (e) => e.course.id === parseInt(courseId)
            );
            setEnrollment(myEnrollment);

            if (lecturesRes.data.length > 0) {
                setCurrentLecture(lecturesRes.data[0]);
            }

            // Fetch pass status for quizzes (best-effort)
            const quizList = quizzesRes.data || [];
            if (quizList.length > 0) {
                const statuses = await Promise.all(
                    quizList.map(async (q) => {
                        try {
                            const res = await quizService.hasPassedQuiz(q.id);
                            return [q.id, Boolean(res.data)];
                        } catch {
                            return [q.id, false];
                        }
                    })
                );
                setQuizPassed(Object.fromEntries(statuses));
            } else {
                setQuizPassed({});
            }

            setLoading(false);
        } catch (err) {
            console.error('Failed to load course', err);
            setError(err?.response?.data?.message || 'Failed to load course');
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    const handleRequestGuide = async () => {
        if (!guideRequest.topic.trim()) {
            alert('Please enter a topic');
            return;
        }

        try {
            setGuideDialogOpen(false);
            setPaymentOpen(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send request');
        }
    };

    const markProgress = async () => {
        try {
            await api.put(`/enrollments/${enrollment.id}/progress`, {
                progressPercent: Math.min(enrollment.progressPercent + 10, 100),
            });
            fetchCourseData();
        } catch (err) {
            console.error('Failed to update progress', err);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography>Loading course...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!enrollment) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">
                    You are not enrolled in this course.{' '}
                    <Button onClick={() => navigate(`/courses/${courseId}`)}>
                        Go to course page
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            {/* Course Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h5" gutterBottom>
                            {course.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Chip label={course.instructor.name} icon={<PlayCircle />} />
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Box>
                            <Typography variant="body2" gutterBottom>
                                Your Progress: {enrollment.progressPercent}%
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={enrollment.progressPercent}
                                sx={{ height: 8, borderRadius: 4 }}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                {/* Sidebar - Course Content */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, maxHeight: '80vh', overflow: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Course Content
                        </Typography>
                        <List>
                            {lectures.map((lecture, index) => (
                                <ListItemButton
                                    key={lecture.id}
                                    selected={currentLecture?.id === lecture.id}
                                    onClick={() => setCurrentLecture(lecture)}
                                >
                                    <ListItemText
                                        primary={`${index + 1}. ${lecture.title}`}
                                        secondary="Available"
                                    />
                                    <PlayCircle />
                                </ListItemButton>
                            ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>
                            Materials
                        </Typography>
                        <List dense>
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
                                        <Description sx={{ mr: 1 }} />
                                        <ListItemText primary={material.title} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>
                            Quiz
                        </Typography>
                        {!canTakeQuiz ? (
                            <Typography variant="body2" color="text.secondary">
                                Complete the course to 100% to unlock the quiz.
                            </Typography>
                        ) : quizzes.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                                No quiz added by the instructor yet.
                            </Typography>
                        ) : (
                            <List dense>
                                {quizzes.map((quiz) => (
                                    <ListItem
                                        key={quiz.id}
                                        disablePadding
                                        secondaryAction={
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                disabled={!canTakeQuiz}
                                                onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                                            >
                                                {quizPassed[quiz.id] ? 'Retake' : 'Take Quiz'}
                                            </Button>
                                        }
                                    >
                                        <ListItemButton
                                            disabled={!canTakeQuiz}
                                            onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                                        >
                                            <Quiz sx={{ mr: 1 }} />
                                            <ListItemText
                                                primary={quiz.title}
                                                secondary={quizPassed[quiz.id] ? 'Passed' : 'Not attempted'}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        )}

                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<ContactSupport />}
                            onClick={() => setGuideDialogOpen(true)}
                            sx={{ mt: 2 }}
                        >
                            Book 1-on-1 Doubt Session
                        </Button>
                    </Paper>
                </Grid>

                {/* Main Content - Lecture Display */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 4, minHeight: '60vh' }}>
                        {currentLecture ? (
                            <>
                                <Typography variant="h4" gutterBottom>
                                    {currentLecture.title}
                                </Typography>
                                <Divider sx={{ my: 3 }} />
                                {currentLecture.videoUrl && (
                                    <Box sx={{ mb: 3 }}>
                                        {(() => {
                                            const url = currentLecture.videoUrl.trim();
                                            const youTubeMatch =
                                                url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/)
                                                || url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
                                            if (youTubeMatch?.[1]) {
                                                const embedUrl = `https://www.youtube.com/embed/${youTubeMatch[1]}`;
                                                return (
                                                    <Box
                                                        component="iframe"
                                                        src={embedUrl}
                                                        title={currentLecture.title}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        sx={{
                                                            width: '100%',
                                                            aspectRatio: '16 / 9',
                                                            border: 0,
                                                            borderRadius: 2,
                                                        }}
                                                    />
                                                );
                                            }

                                            if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
                                                return (
                                                    <Box
                                                        component="video"
                                                        src={url}
                                                        controls
                                                        sx={{ width: '100%', borderRadius: 2 }}
                                                    />
                                                );
                                            }

                                            return (
                                                <Button
                                                    variant="outlined"
                                                    href={url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Open Video Link
                                                </Button>
                                            );
                                        })()}
                                    </Box>
                                )}
                                {currentLecture.imageUrl && (
                                    <Box
                                        component="img"
                                        src={currentLecture.imageUrl}
                                        alt={currentLecture.title}
                                        sx={{ width: '100%', mb: 3, borderRadius: 2 }}
                                    />
                                )}
                                <Typography
                                    variant="body1"
                                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
                                >
                                    {currentLecture.content}
                                </Typography>
                                <Box sx={{ mt: 4 }}>
                                    <Button
                                        variant="contained"
                                        onClick={markProgress}
                                        startIcon={<CheckCircle />}
                                    >
                                        Mark as Complete
                                    </Button>
                                </Box>
                            </>
                        ) : (
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <Typography variant="h6" color="text.secondary">
                                    Select a lecture to start learning
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Guide Request Dialog */}
            <Dialog open={guideDialogOpen} onClose={() => setGuideDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Book 1-on-1 Doubt Session</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Topic"
                        value={guideRequest.topic}
                        onChange={(e) =>
                            setGuideRequest({ ...guideRequest, topic: e.target.value })
                        }
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={guideRequest.description}
                        onChange={(e) =>
                            setGuideRequest({ ...guideRequest, description: e.target.value })
                        }
                        margin="normal"
                        multiline
                        rows={4}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setGuideDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleRequestGuide}>
                        Continue to Payment
                    </Button>
                </DialogActions>
            </Dialog>

            <PaymentModal
                open={paymentOpen}
                onClose={() => setPaymentOpen(false)}
                courseId={course?.id}
                instructorId={course?.instructor?.id}
                topic={guideRequest.topic}
                description={guideRequest.description}
                amount={999}
                onSuccess={() => {
                    alert('Session request sent successfully!');
                    setGuideRequest({ topic: '', description: '' });
                    fetchCourseData();
                }}
            />
        </Container>
    );
};

export default LearnCourse;
