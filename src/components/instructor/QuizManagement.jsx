import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    TextField,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Grid,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import {
    Add,
    Delete,
    Quiz as QuizIcon,
    Timer,
    CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../services/api';

const QuizManagement = () => {
    const { courseId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState(null);
    const [loading, setLoading] = useState(false);

    const [quizData, setQuizData] = useState({
        title: '',
        timeLimit: 30,
        passingScore: 70,
        maxAttempts: 3,
    });

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
    });

    const fetchQuizzes = useCallback(async () => {
        try {
            const response = await api.get(`/quizzes/course/${courseId}`);
            setQuizzes(response.data);
        } catch (err) {
            console.error('Failed to load quizzes', err);
        }
    }, [courseId]);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    const handleCreateQuiz = () => {
        setEditingQuiz(null);
        setQuizData({
            title: '',
            timeLimit: 30,
            passingScore: 70,
            maxAttempts: 3,
        });
        setQuestions([]);
        setDialogOpen(true);
    };

    const handleAddQuestion = () => {
        if (!currentQuestion.questionText.trim()) {
            alert('Please enter a question');
            return;
        }
        if (!currentQuestion.optionA.trim() || !currentQuestion.optionB.trim() || !currentQuestion.optionC.trim() || !currentQuestion.optionD.trim()) {
            alert('Please fill all options (A, B, C, D)');
            return;
        }
        setQuestions([...questions, { ...currentQuestion }]);
        setCurrentQuestion({
            questionText: '',
            optionA: '',
            optionB: '',
            optionC: '',
            optionD: '',
            correctAnswer: 'A',
        });
        setQuestionDialogOpen(false);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSaveQuiz = async () => {
        if (!quizData.title.trim()) {
            alert('Please enter quiz title');
            return;
        }
        if (!quizData.timeLimit || Number(quizData.timeLimit) <= 0) {
            alert('Time limit must be greater than 0');
            return;
        }
        if (quizData.passingScore == null || Number(quizData.passingScore) < 0 || Number(quizData.passingScore) > 100) {
            alert('Passing score must be between 0 and 100');
            return;
        }
        if (!quizData.maxAttempts || Number(quizData.maxAttempts) <= 0) {
            alert('Max attempts must be greater than 0');
            return;
        }
        if (questions.length === 0) {
            alert('Please add at least one question');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...quizData,
                courseId: parseInt(courseId),
                timeLimit: Number(quizData.timeLimit),
                passingScore: Number(quizData.passingScore),
                maxAttempts: Number(quizData.maxAttempts),
                questions: questions,
            };

            if (editingQuiz) {
                await api.put(`/quizzes/${editingQuiz.id}`, payload);
                alert('Quiz updated successfully!');
            } else {
                await api.post('/quizzes', payload);
                alert('Quiz created successfully!');
            }

            setDialogOpen(false);
            fetchQuizzes();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save quiz');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteQuiz = async (quizId) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await api.delete(`/quizzes/${quizId}`);
                alert('Quiz deleted successfully');
                fetchQuizzes();
            } catch (err) {
                alert('Failed to delete quiz');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Quiz Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleCreateQuiz}
                    sx={{
                        background: (theme) => theme.custom?.gradients?.primary,
                        px: 3,
                    }}
                >
                    Create Quiz
                </Button>
            </Box>

            {quizzes.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <QuizIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No quizzes created yet
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleCreateQuiz}
                        sx={{ mt: 2 }}
                    >
                        Create Your First Quiz
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {quizzes.map((quiz, index) => (
                        <Grid item xs={12} md={6} key={quiz.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                            <Typography variant="h6" fontWeight="bold">
                                                {quiz.title}
                                            </Typography>
                                            <Box>
                                                <IconButton size="small" color="error" onClick={() => handleDeleteQuiz(quiz.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                            <Chip
                                                icon={<Timer />}
                                                label={`${quiz.timeLimit} min`}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                            <Chip
                                                icon={<CheckCircle />}
                                                label={`Pass: ${quiz.passingScore}%`}
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                            />
                                            <Chip
                                                label={`${quiz.questions?.length || 0} Questions`}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary">
                                            Max Attempts: {quiz.maxAttempts}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create/Edit Quiz Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ background: (theme) => theme.custom?.gradients?.primary, color: 'white' }}>
                    {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Quiz Title"
                        value={quizData.title}
                        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                        margin="normal"
                        required
                    />

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Time Limit (minutes)"
                                type="number"
                                value={quizData.timeLimit}
                                onChange={(e) => setQuizData({ ...quizData, timeLimit: parseInt(e.target.value) })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Passing Score (%)"
                                type="number"
                                value={quizData.passingScore}
                                onChange={(e) => setQuizData({ ...quizData, passingScore: parseInt(e.target.value) })}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                label="Max Attempts"
                                type="number"
                                value={quizData.maxAttempts}
                                onChange={(e) => setQuizData({ ...quizData, maxAttempts: parseInt(e.target.value) })}
                                margin="normal"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                            Questions ({questions.length})
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={() => setQuestionDialogOpen(true)}
                        >
                            Add Question
                        </Button>
                    </Box>

                    <List>
                        {questions.map((q, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => handleRemoveQuestion(index)}>
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
                                    primary={`${index + 1}. ${q.questionText}`}
                                    secondary={`Correct Answer: ${q.correctAnswer}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveQuiz}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Quiz'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Question Dialog */}
            <Dialog open={questionDialogOpen} onClose={() => setQuestionDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Question</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Question"
                        value={currentQuestion.questionText}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, questionText: e.target.value })}
                        margin="normal"
                        multiline
                        rows={2}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Option A"
                        value={currentQuestion.optionA}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionA: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Option B"
                        value={currentQuestion.optionB}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionB: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Option C"
                        value={currentQuestion.optionC}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionC: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Option D"
                        value={currentQuestion.optionD}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, optionD: e.target.value })}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Correct Answer</InputLabel>
                        <Select
                            value={currentQuestion.correctAnswer}
                            onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                            label="Correct Answer"
                        >
                            <MenuItem value="A">A</MenuItem>
                            <MenuItem value="B">B</MenuItem>
                            <MenuItem value="C">C</MenuItem>
                            <MenuItem value="D">D</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setQuestionDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default QuizManagement;
