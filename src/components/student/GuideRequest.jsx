import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
} from '@mui/material';
import { guideService } from '../../services/guideService';

const GuideRequest = ({ open, onClose, courseId, instructorId, enrollmentId }) => {
    const [formData, setFormData] = useState({
        topic: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!formData.topic.trim()) {
            setError('Please enter a topic');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await guideService.createGuideRequest({
                courseId,
                instructorId,
                topic: formData.topic,
                description: formData.description,
            });

            alert('Guide request sent successfully!');
            onClose();
            setFormData({ topic: '', description: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Request Instructor Guidance</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <TextField
                    fullWidth
                    label="Topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    margin="normal"
                    multiline
                    rows={4}
                    placeholder="Explain what you need help with..."
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Request'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GuideRequest;
