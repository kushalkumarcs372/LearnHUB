import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
} from '@mui/material';
import { Add, Edit, Delete, CloudUpload, Quiz } from '@mui/icons-material';
import { courseService } from '../../services/courseService';
import { quizService } from '../../services/quizService';
import MaterialUpload from './MaterialUpload';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [lectures, setLectures] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [courseStatus, setCourseStatus] = useState('DRAFT');

    // Course Edit State
    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        categoryId: '',
        price: 0,
    });

    // Lecture Dialog State
    const [lectureDialogOpen, setLectureDialogOpen] = useState(false);
    const [lectureData, setLectureData] = useState({
        title: '',
        content: '',
        orderNumber: 0,
        imageUrl: '',
        videoUrl: '',
    });
    const [editingLecture, setEditingLecture] = useState(null);

    // Material Upload Dialog State
    const [materialUploadOpen, setMaterialUploadOpen] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [courseRes, lecturesRes, materialsRes, categoriesRes, quizzesRes] = await Promise.all([
                courseService.getCourseById(id),
                courseService.getCourseLectures(id),
                courseService.getCourseMaterials(id),
                courseService.getAllCategories(),
                quizService.getCourseQuizzes(id),
            ]);

            setLectures(lecturesRes.data);
            setMaterials(materialsRes.data);
            setCategories(categoriesRes.data);
            setQuizzes(quizzesRes.data || []);

            setCourseData({
                title: courseRes.data.title,
                description: courseRes.data.description,
                categoryId: courseRes.data.category?.id || '',
                price: courseRes.data.price,
            });
            setCourseStatus(courseRes.data.status || 'DRAFT');

            setLoading(false);
        } catch (err) {
            setError('Failed to load course data');
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdateCourse = async () => {
        try {
            await courseService.updateCourse(id, courseData);
            alert('Course updated successfully!');
            fetchData();
        } catch (err) {
            alert('Failed to update course');
        }
    };

    const handlePublishCourse = async () => {
        if (!window.confirm('Publish this course? Students will be able to see it in the catalog.')) return;
        try {
            await courseService.publishCourse(id);
            alert('Course published successfully!');
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to publish course');
        }
    };

    const handleAddLecture = () => {
        setEditingLecture(null);
        setLectureData({
            title: '',
            content: '',
            orderNumber: lectures.length + 1,
            imageUrl: '',
            videoUrl: '',
        });
        setLectureDialogOpen(true);
    };

    const handleEditLecture = (lecture) => {
        setEditingLecture(lecture);
        setLectureData({
            title: lecture.title,
            content: lecture.content,
            orderNumber: lecture.orderNumber,
            imageUrl: lecture.imageUrl || '',
            videoUrl: lecture.videoUrl || '',
        });
        setLectureDialogOpen(true);
    };

    const handleSaveLecture = async () => {
        try {
            const payload = {
                ...lectureData,
                courseId: parseInt(id),
            };

            if (editingLecture) {
                await courseService.updateLecture(editingLecture.id, payload);
                alert('Lecture updated successfully!');
            } else {
                await courseService.createLecture(payload);
                alert('Lecture added successfully!');
            }

            setLectureDialogOpen(false);
            fetchData();
        } catch (err) {
            alert('Failed to save lecture');
        }
    };

    const handleDeleteLecture = async (lectureId) => {
        if (window.confirm('Are you sure you want to delete this lecture?')) {
            try {
                await courseService.deleteLecture(lectureId);
                alert('Lecture deleted successfully!');
                fetchData();
            } catch (err) {
                alert('Failed to delete lecture');
            }
        }
    };

    const handleDeleteMaterial = async (materialId) => {
        if (window.confirm('Are you sure you want to delete this material?')) {
            try {
                await courseService.deleteMaterial(materialId);
                alert('Material deleted successfully!');
                fetchData();
            } catch (err) {
                alert('Failed to delete material');
            }
        }
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Edit Course</Typography>
                <Button variant="outlined" onClick={() => navigate('/instructor/courses')}>
                    Back to Courses
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {courseStatus === 'DRAFT' && (
                <Alert
                    severity="warning"
                    sx={{ mb: 3 }}
                    action={
                        <Button color="inherit" size="small" onClick={handlePublishCourse}>
                            Publish
                        </Button>
                    }
                >
                    This course is currently a draft. Publish it to make it visible for students.
                </Alert>
            )}

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tab} onChange={(e, v) => setTab(v)}>
                    <Tab label="Course Details" />
                    <Tab label="Lectures" />
                    <Tab label="Materials" />
                    <Tab label="Quizzes" />
                </Tabs>
            </Paper>

            {/* Course Details Tab */}
            {tab === 0 && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Course Information
                    </Typography>
                    <TextField
                        fullWidth
                        label="Title"
                        value={courseData.title}
                        onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={courseData.description}
                        onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={courseData.categoryId}
                            onChange={(e) =>
                                setCourseData({
                                    ...courseData,
                                    categoryId: e.target.value === '' ? '' : Number(e.target.value),
                                })
                            }
                            label="Category"
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Price"
                        type="number"
                        value={courseData.price}
                        onChange={(e) => setCourseData({ ...courseData, price: parseFloat(e.target.value) })}
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleUpdateCourse} sx={{ mt: 2 }}>
                        Update Course
                    </Button>
                </Paper>
            )}

            {/* Lectures Tab */}
            {tab === 1 && (
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">Lectures ({lectures.length})</Typography>
                        <Button variant="contained" startIcon={<Add />} onClick={handleAddLecture}>
                            Add Lecture
                        </Button>
                    </Box>

                    <List>
                        {lectures.length === 0 ? (
                            <Typography color="text.secondary">No lectures yet. Add your first lecture!</Typography>
                        ) : (
                            lectures.map((lecture, index) => (
                                <ListItem
                                    key={lecture.id}
                                    secondaryAction={
                                        <Box>
                                            <IconButton onClick={() => handleEditLecture(lecture)}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteLecture(lecture.id)}>
                                                <Delete />
                                            </IconButton>
                                        </Box>
                                    }
                                    sx={{
                                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                                        mb: 1,
                                        borderRadius: 2,
                                    }}
                                >
                                    <ListItemText
                                        primary={`${index + 1}. ${lecture.title}`}
                                        secondary={lecture.content?.substring(0, 100) + '...'}
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </Paper>
            )}

            {/* Materials Tab */}
            {tab === 2 && (
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">Study Materials ({materials.length})</Typography>
                        <Button
                            variant="contained"
                            startIcon={<CloudUpload />}
                            onClick={() => setMaterialUploadOpen(true)}
                        >
                            Upload Material
                        </Button>
                    </Box>

                    <List>
                        {materials.length === 0 ? (
                            <Typography color="text.secondary">No materials uploaded yet.</Typography>
                        ) : (
                            materials.map((material) => (
                                <ListItem
                                    key={material.id}
                                    secondaryAction={
                                        <IconButton edge="end" onClick={() => handleDeleteMaterial(material.id)}>
                                            <Delete />
                                        </IconButton>
                                    }
                                    sx={{
                                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                                        mb: 1,
                                        borderRadius: 2,
                                    }}
                                >
                                    <ListItemText
                                        primary={material.title}
                                        secondary={
                                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                                <Chip label={material.fileType} size="small" />
                                                <Chip
                                                    label={`${(material.fileSize / 1024 / 1024).toFixed(2)} MB`}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))
                        )}
                    </List>
                </Paper>
            )}

            {/* Quizzes Tab */}
            {tab === 3 && (
                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6">Quizzes ({quizzes.length})</Typography>
                        <Button
                            variant="contained"
                            startIcon={<Quiz />}
                            onClick={() => navigate(`/instructor/courses/${id}/quizzes`)}
                        >
                            Manage Quizzes
                        </Button>
                    </Box>

                    {quizzes.length === 0 ? (
                        <Alert severity="info">
                            No quizzes created yet. Click "Manage Quizzes" to create your first quiz.
                        </Alert>
                    ) : (
                        <Grid container spacing={2}>
                            {quizzes.map((quiz) => (
                                <Grid item xs={12} md={6} key={quiz.id}>
                                    <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                        <Typography variant="h6" gutterBottom>
                                            {quiz.title}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Chip label={`${quiz.questions?.length || 0} Questions`} size="small" />
                                            <Chip label={`${quiz.timeLimit} min`} size="small" color="primary" />
                                            <Chip label={`Pass: ${quiz.passingScore}%`} size="small" color="success" />
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Paper>
            )}

            {/* Lecture Dialog */}
            <Dialog open={lectureDialogOpen} onClose={() => setLectureDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingLecture ? 'Edit Lecture' : 'Add New Lecture'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Lecture Title"
                        value={lectureData.title}
                        onChange={(e) => setLectureData({ ...lectureData, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        value={lectureData.content}
                        onChange={(e) => setLectureData({ ...lectureData, content: e.target.value })}
                        margin="normal"
                        multiline
                        rows={10}
                    />
                    <TextField
                        fullWidth
                        label="Order Number"
                        type="number"
                        value={lectureData.orderNumber}
                        onChange={(e) => setLectureData({ ...lectureData, orderNumber: parseInt(e.target.value) })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Image URL (optional)"
                        value={lectureData.imageUrl}
                        onChange={(e) => setLectureData({ ...lectureData, imageUrl: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Video URL (optional)"
                        value={lectureData.videoUrl}
                        onChange={(e) => setLectureData({ ...lectureData, videoUrl: e.target.value })}
                        margin="normal"
                        helperText="YouTube/Drive/MP4 link. Students will see it inside the lecture."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setLectureDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveLecture}>
                        {editingLecture ? 'Update' : 'Add'} Lecture
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Material Upload Dialog */}
            <MaterialUpload
                open={materialUploadOpen}
                onClose={() => setMaterialUploadOpen(false)}
                courseId={id}
                onSuccess={fetchData}
            />
        </Container>
    );
};

export default EditCourse;
