import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Tabs,
    Tab,
} from '@mui/material';
import { guideService } from '../../services/guideService';

const GuideRequests = () => {
    const [requests, setRequests] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [scheduleError, setScheduleError] = useState('');
    const [scheduleData, setScheduleData] = useState({
        scheduledAt: '',
        durationMinutes: 60,
        meetingLink: '',
    });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await guideService.getInstructorRequests();
            setRequests(res.data);
        } catch (err) {
            console.error('Failed to load requests', err);
        }
    };

    const handleRespond = (request, status) => {
        setSelectedRequest(request);
        setDialogOpen(true);
        setResponse('');
        setError('');
    };

    const handleOpenSchedule = (request) => {
        setSelectedRequest(request);
        setScheduleError('');
        setScheduleData({ scheduledAt: '', durationMinutes: 60, meetingLink: '' });
        setScheduleDialogOpen(true);
    };

    const handleSubmitResponse = async (status) => {
        if (!response.trim()) {
            setError('Please enter a response');
            return;
        }

        setLoading(true);
        try {
            await guideService.respondToRequest(selectedRequest.id, {
                requestId: selectedRequest.id,
                status: status,
                instructorResponse: response,
            });
            alert(`Request ${status.toLowerCase()} successfully!`);
            setDialogOpen(false);
            fetchRequests();
        } catch (err) {
            setError('Failed to respond to request');
        } finally {
            setLoading(false);
        }
    };

    const handleScheduleSession = async () => {
        if (!selectedRequest?.id) return;
        if (!scheduleData.scheduledAt) {
            setScheduleError('Please select a date & time');
            return;
        }
        setScheduleLoading(true);
        setScheduleError('');
        try {
            await guideService.scheduleSession({
                guideRequestId: selectedRequest.id,
                scheduledAt: scheduleData.scheduledAt,
                durationMinutes: Number(scheduleData.durationMinutes) || 60,
                meetingLink: scheduleData.meetingLink,
            });
            alert('Session scheduled successfully!');
            setScheduleDialogOpen(false);
        } catch (err) {
            setScheduleError(err.response?.data?.message || 'Failed to schedule session');
        } finally {
            setScheduleLoading(false);
        }
    };

    const pendingRequests = requests.filter(r => r.status === 'PENDING');
    const respondedRequests = requests.filter(r => r.status !== 'PENDING');

    const displayedRequests = tabValue === 0 ? pendingRequests : respondedRequests;

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'warning';
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            case 'COMPLETED': return 'info';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Guide Requests
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                    <Tab label={`Pending (${pendingRequests.length})`} />
                    <Tab label={`Responded (${respondedRequests.length})`} />
                </Tabs>
            </Paper>

            {displayedRequests.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No {tabValue === 0 ? 'pending' : 'responded'} requests
                    </Typography>
                </Paper>
            ) : (
                <List>
                    {displayedRequests.map((request) => (
                        <Paper key={request.id} sx={{ mb: 2, p: 2 }}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="h6">{request.topic}</Typography>
                                            <Chip
                                                label={request.status}
                                                color={getStatusColor(request.status)}
                                                size="small"
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="text.secondary" paragraph>
                                                {request.description}
                                            </Typography>
                                            <Typography variant="caption" display="block">
                                                Student: {request.student?.name}
                                            </Typography>
                                            <Typography variant="caption" display="block">
                                                Course: {request.course?.title}
                                            </Typography>
                                            <Typography variant="caption" display="block" color="text.secondary">
                                                Requested: {new Date(request.requestedAt).toLocaleString()}
                                            </Typography>
                                            {request.instructorResponse && (
                                                <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Your Response:
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {request.instructorResponse}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </>
                                    }
                                />
                            </ListItem>
                            {request.status === 'PENDING' && (
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleRespond(request, 'REJECTED')}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => handleRespond(request, 'APPROVED')}
                                    >
                                        Approve
                                    </Button>
                                </Box>
                            )}
                            {request.status === 'APPROVED' && (
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleOpenSchedule(request)}
                                    >
                                        Schedule Session
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    ))}
                </List>
            )}

            {/* Response Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Respond to Request</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        fullWidth
                        label="Your Response"
                        multiline
                        rows={4}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        margin="normal"
                        placeholder="Enter your response to the student..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleSubmitResponse('REJECTED')}
                        disabled={loading}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleSubmitResponse('APPROVED')}
                        disabled={loading}
                    >
                        {loading ? 'Approving...' : 'Approve'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Schedule Session Dialog */}
            <Dialog open={scheduleDialogOpen} onClose={() => setScheduleDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Schedule Session</DialogTitle>
                <DialogContent>
                    {scheduleError && <Alert severity="error" sx={{ mb: 2 }}>{scheduleError}</Alert>}
                    <TextField
                        fullWidth
                        label="Date & Time"
                        type="datetime-local"
                        value={scheduleData.scheduledAt}
                        onChange={(e) => setScheduleData({ ...scheduleData, scheduledAt: e.target.value })}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        fullWidth
                        label="Duration (minutes)"
                        type="number"
                        value={scheduleData.durationMinutes}
                        onChange={(e) => setScheduleData({ ...scheduleData, durationMinutes: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Meeting Link (optional)"
                        value={scheduleData.meetingLink}
                        onChange={(e) => setScheduleData({ ...scheduleData, meetingLink: e.target.value })}
                        margin="normal"
                        placeholder="Google Meet / Zoom link"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setScheduleDialogOpen(false)} disabled={scheduleLoading}>Cancel</Button>
                    <Button variant="contained" onClick={handleScheduleSession} disabled={scheduleLoading}>
                        {scheduleLoading ? 'Scheduling...' : 'Schedule'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default GuideRequests;
