import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    LinearProgress,
    Card,
    CardContent,
    Chip,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Rating,
    TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';
import {
    Timer,
    CheckCircle,
    Cancel,
    EmojiEvents,
    ArrowBack,
    ArrowForward,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

const TakeQuiz = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState(false);
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [appRating, setAppRating] = useState(5);
    const [appRatingComment, setAppRatingComment] = useState('');
    const [recommend, setRecommend] = useState('YES');
    const [easeOfUse, setEaseOfUse] = useState(5);
    const [contentQuality, setContentQuality] = useState(5);
    const [ratingSubmitting, setRatingSubmitting] = useState(false);
    const [ratingError, setRatingError] = useState('');

    const fetchQuiz = useCallback(async () => {
        try {
            const response = await api.get(`/quizzes/${quizId}`);
            setQuiz(response.data);
            setQuestions(response.data.questions || []);
            setTimeLeft(response.data.timeLimit * 60);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load quiz', err);
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => {
        fetchQuiz();
    }, [fetchQuiz]);

    useEffect(() => {
        // Prompt for app rating when a new certificate is issued.
        const maybePromptRating = async () => {
            if (!quizSubmitted || !result?.passed || !result?.certificateGenerated || !result?.certificateId) return;

            try {
                // If user already rated, don't prompt again.
                await api.get('/app-ratings/me');
            } catch (err) {
                if (err.response?.status === 404) {
                    setRatingDialogOpen(true);
                }
            }
        };

        maybePromptRating();
    }, [quizSubmitted, result]);

    const handleSubmitQuiz = useCallback(async () => {
        if (!quiz) return;
        setConfirmDialog(false);
        setLoading(true);

        try {
            const timeTaken = (quiz.timeLimit * 60) - timeLeft;
            const response = await api.post('/quiz-attempts/submit', {
                quizId: parseInt(quizId),
                answers: answers,
                timeTaken: timeTaken,
            });

            setResult(response.data);
            setQuizSubmitted(true);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit quiz');
        } finally {
            setLoading(false);
        }
    }, [answers, quiz, quizId, timeLeft]);

    const submitAppRating = async () => {
        setRatingError('');
        if (!appRating) {
            setRatingError('Please select a rating');
            return;
        }

        setRatingSubmitting(true);
        try {
            await api.post('/app-ratings', {
                rating: appRating,
                recommend: recommend === 'YES',
                easeOfUse,
                contentQuality,
                comment: appRatingComment,
            });
            setRatingDialogOpen(false);
        } catch (err) {
            setRatingError(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setRatingSubmitting(false);
        }
    };

    useEffect(() => {
        if (!quizStarted) return undefined;

        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }

        if (timeLeft === 0 && quiz && !quizSubmitted) {
            handleSubmitQuiz();
        }

        return undefined;
    }, [handleSubmitQuiz, quiz, quizStarted, quizSubmitted, timeLeft]);

    const handleStartQuiz = () => {
        setQuizStarted(true);
    };

    const handleAnswerChange = (questionId, answer) => {
        setAnswers({ ...answers, [questionId]: answer });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };



    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography>Loading quiz...</Typography>
            </Box>
        );
    }

    // Quiz Result View
    if (quizSubmitted && result) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Paper
                        sx={{
                            p: 6,
                            textAlign: 'center',
                            borderRadius: 4,
                            background: (theme) =>
                                result.passed
                                    ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.12)} 0%, ${alpha(
                                          theme.palette.success.main,
                                          0.22
                                      )} 100%)`
                                    : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.12)} 0%, ${alpha(
                                          theme.palette.error.main,
                                          0.22
                                      )} 100%)`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 120,
                                height: 120,
                                margin: '0 auto 24px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: result.passed ? 'success.main' : 'error.main',
                            }}
                        >
                            {result.passed ? (
                                <EmojiEvents sx={{ fontSize: 60, color: 'white' }} />
                            ) : (
                                <Cancel sx={{ fontSize: 60, color: 'white' }} />
                            )}
                        </Box>

                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            {result.score}%
                        </Typography>

                        <Typography variant="h5" color={result.passed ? 'success.main' : 'error.main'} gutterBottom>
                            {result.passed ? '🎉 Congratulations! You Passed!' : '😔 Keep Trying!'}
                        </Typography>

                        <Box sx={{ mt: 4, mb: 4 }}>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h4" color="primary">
                                            {result.correctAnswers}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Correct
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h4" color="error">
                                            {result.totalQuestions - result.correctAnswers}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Incorrect
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h4">
                                            {formatTime(result.timeTaken)}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Time Taken
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={6} md={3}>
                                    <Paper sx={{ p: 2 }}>
                                        <Typography variant="h4" color="warning.main">
                                            {result.passingScore}%
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Passing Score
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate(-1)}
                            >
                                Back to Course
                            </Button>

                            {result.passed && result.certificateId && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={() => navigate(`/student/certificates?certificateId=${encodeURIComponent(result.certificateId)}`)}
                                >
                                    View Certificate
                                </Button>
                            )}
                        </Box>
                    </Paper>
                </motion.div>

                <Dialog open={ratingDialogOpen} onClose={() => setRatingDialogOpen(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>Rate LearnHub</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            You just earned a certificate. Help us improve LearnHub in 15 seconds.
                        </Typography>

                        {ratingError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {ratingError}
                            </Alert>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Rating
                                value={appRating}
                                onChange={(e, value) => setAppRating(value || 0)}
                                size="large"
                            />
                            <Typography variant="body2" color="text.secondary">
                                {appRating}/5
                            </Typography>
                        </Box>

                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel>Would you recommend LearnHub to a friend?</FormLabel>
                            <RadioGroup
                                row
                                value={recommend}
                                onChange={(e) => setRecommend(e.target.value)}
                            >
                                <FormControlLabel value="YES" control={<Radio />} label="Yes" />
                                <FormControlLabel value="NO" control={<Radio />} label="No" />
                            </RadioGroup>
                        </FormControl>

                        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Ease of use
                                </Typography>
                                <Rating
                                    value={easeOfUse}
                                    onChange={(e, value) => setEaseOfUse(value || 0)}
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Content quality
                                </Typography>
                                <Rating
                                    value={contentQuality}
                                    onChange={(e, value) => setContentQuality(value || 0)}
                                />
                            </Box>
                        </Box>

                        <TextField
                            fullWidth
                            label="Comment (optional)"
                            value={appRatingComment}
                            onChange={(e) => setAppRatingComment(e.target.value)}
                            multiline
                            rows={3}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setRatingDialogOpen(false)} disabled={ratingSubmitting}>
                            Later
                        </Button>
                        <Button variant="contained" onClick={submitAppRating} disabled={ratingSubmitting}>
                            {ratingSubmitting ? 'Submitting...' : 'Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }

    // Quiz Start Screen
    if (!quizStarted) {
        return (
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper sx={{ p: 6, borderRadius: 4 }}>
                    <Typography variant="h3" fontWeight="bold" gutterBottom>
                        {quiz.title}
                    </Typography>

                      <Box sx={{ my: 4 }}>
                        <Card sx={{ mb: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc') }}>
                              <CardContent>
                                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Chip
                                        icon={<Timer />}
                                        label={`Time Limit: ${quiz.timeLimit} minutes`}
                                        color="primary"
                                    />
                                    <Chip
                                        icon={<CheckCircle />}
                                        label={`Passing Score: ${quiz.passingScore}%`}
                                        color="success"
                                    />
                                    <Chip
                                        label={`${questions.length} Questions`}
                                        color="info"
                                    />
                                    <Chip
                                        label={`Max Attempts: ${quiz.maxAttempts}`}
                                        color="warning"
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                📋 Read each question carefully<br />
                                ⏱️ Timer starts when you click "Start Quiz"<br />
                                ✅ You can navigate between questions<br />
                                ⚠️ Quiz will auto-submit when time runs out
                            </Typography>
                        </Alert>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleStartQuiz}
                            fullWidth
                            sx={{
                                background: (theme) => theme.custom?.gradients?.primary,
                            }}
                        >
                            Start Quiz
                        </Button>
                    </Box>
                </Paper>
            </Container>
        );
    }

    // Quiz Taking Interface
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="bold">
                        {quiz.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                            icon={<Timer sx={{ color: 'white !important' }} />}
                            label={formatTime(timeLeft)}
                            sx={{
                                bgcolor: timeLeft < 60 ? '#ef4444' : 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </Typography>
                        <Typography variant="body2">
                            {Math.round(progress)}% Complete
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: 'rgba(255,255,255,0.2)',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: 'rgba(255,255,255,0.95)',
                            },
                        }}
                    />
                </Box>
            </Paper>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Paper sx={{ p: 4, borderRadius: 3 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            {currentQuestion.questionText}
                        </Typography>

                        <FormControl component="fieldset" fullWidth sx={{ mt: 4 }}>
                            <RadioGroup
                                value={answers[currentQuestion.id] || ''}
                                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            >
                                {['A', 'B', 'C', 'D'].map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio />}
                                        label={
                                            <Typography variant="body1">
                                                <strong>{option}.</strong> {currentQuestion[`option${option}`]}
                                            </Typography>
                                        }
                                        sx={{
                                            p: 2,
                                            mb: 1,
                                            borderRadius: 2,
                                            border: '2px solid',
                                            borderColor: (theme) =>
                                                answers[currentQuestion.id] === option
                                                    ? theme.palette.primary.main
                                                    : alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.26 : 0.18),
                                            bgcolor: (theme) =>
                                                answers[currentQuestion.id] === option
                                                    ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.08)
                                                    : 'transparent',
                                            transition:
                                                'border-color 180ms cubic-bezier(0.16, 1, 0.3, 1), background-color 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                                        }}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                >
                    Previous
                </Button>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    {currentQuestionIndex === questions.length - 1 ? (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={() => setConfirmDialog(true)}
                            sx={{ px: 4 }}
                        >
                            Submit Quiz
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            endIcon={<ArrowForward />}
                            onClick={handleNextQuestion}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Confirm Submit Dialog */}
            <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
                <DialogTitle>Submit Quiz?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to submit? You have answered {Object.keys(answers).length} out of {questions.length} questions.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialog(false)}>Review</Button>
                    <Button variant="contained" color="success" onClick={handleSubmitQuiz}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default TakeQuiz;
