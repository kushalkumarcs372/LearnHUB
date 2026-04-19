import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Grid,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import { EventAvailable, PendingActions, CheckCircle, Cancel, Update } from '@mui/icons-material';
import { guideService } from '../../services/guideService';

const statusColor = (status) => {
    switch (status) {
        case 'SCHEDULED':
        case 'APPROVED':
            return 'success';
        case 'PENDING':
            return 'warning';
        case 'CANCELLED':
        case 'REJECTED':
            return 'error';
        case 'COMPLETED':
            return 'info';
        default:
            return 'default';
    }
};

const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    // If backend sends epoch or invalid date, keep it simple:
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString();
};

const InstructorSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    const loadSessions = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await guideService.getInstructorSessions();
            setSessions(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load sessions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSessions();
    }, []);

    const sortedSessions = useMemo(() => {
        return [...sessions].sort((a, b) => {
            const at = new Date(a.scheduledAt || a.startTime || a.createdAt || 0).getTime();
            const bt = new Date(b.scheduledAt || b.startTime || b.createdAt || 0).getTime();
            return bt - at;
        });
    }, [sessions]);

    const updateStatus = async (sessionId, status) => {
        setUpdatingId(sessionId);
        try {
            await guideService.updateSessionStatus(sessionId, { status });
            await loadSessions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update session status.');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <Box>
            <Box
                sx={{
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                    py: 6,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="h3" fontWeight={900} gutterBottom>
                                Sessions
                            </Typography>
                            <Typography sx={{ opacity: 0.92 }}>
                                Manage scheduled guidance sessions with students.
                            </Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            startIcon={<Update />}
                            onClick={loadSessions}
                            sx={{
                                borderColor: 'rgba(255,255,255,0.65)',
                                color: 'white',
                                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.14)' },
                            }}
                        >
                            Refresh
                        </Button>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: -3, pb: 6 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <EventAvailable />
                            <Typography variant="h6" fontWeight={900}>
                                Your Sessions
                            </Typography>
                            {!loading && (
                                <Chip
                                    icon={<PendingActions />}
                                    label={`${sortedSessions.length} total`}
                                    size="small"
                                    sx={{ bgcolor: 'action.hover' }}
                                />
                            )}
                        </Box>
                    </Box>

                    {loading ? (
                        <Grid container spacing={2}>
                            {Array.from({ length: 6 }).map((_, idx) => (
                                <Grid item xs={12} md={6} key={idx}>
                                    <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                                        <Skeleton variant="text" width="65%" height={28} />
                                        <Skeleton variant="text" width="40%" />
                                        <Skeleton variant="text" width="85%" />
                                        <Skeleton variant="rounded" height={44} sx={{ mt: 2 }} />
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    ) : sortedSessions.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Typography variant="h6" color="text.secondary" fontWeight={800} gutterBottom>
                                No sessions yet
                            </Typography>
                            <Typography color="text.secondary">
                                When students book guidance sessions, they’ll appear here.
                            </Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={2}>
                            {sortedSessions.map((session) => {
                                const sessionId = session.id;
                                const when = session.scheduledAt || session.startTime || session.sessionTime;
                                const studentName = session.student?.name || session.studentName || 'Student';
                                const courseTitle = session.course?.title || session.courseTitle || 'Course';
                                const status = session.status || 'PENDING';

                                return (
                                    <Grid item xs={12} md={6} key={sessionId}>
                                        <Paper sx={{ p: 2.5, borderRadius: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                                <Box sx={{ minWidth: 0 }}>
                                                    <Typography variant="subtitle1" fontWeight={900} noWrap>
                                                        {studentName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" noWrap>
                                                        {courseTitle}
                                                    </Typography>
                                                </Box>
                                                <Chip label={status} color={statusColor(status)} size="small" />
                                            </Box>

                                            <Typography variant="body2" sx={{ mt: 1.5 }}>
                                                <strong>When:</strong> {formatDateTime(when)}
                                            </Typography>
                                            {session.topic && (
                                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                    <strong>Topic:</strong> {session.topic}
                                                </Typography>
                                            )}

                                            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    startIcon={<CheckCircle />}
                                                    disabled={updatingId === sessionId}
                                                    onClick={() => updateStatus(sessionId, 'COMPLETED')}
                                                >
                                                    Mark Completed
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    color="error"
                                                    startIcon={<Cancel />}
                                                    disabled={updatingId === sessionId}
                                                    onClick={() => updateStatus(sessionId, 'CANCELLED')}
                                                >
                                                    Cancel
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default InstructorSessions;
