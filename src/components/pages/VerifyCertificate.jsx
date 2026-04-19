import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    Container,
    Paper,
    Skeleton,
    Typography,
} from '@mui/material';
import { CheckCircle, ErrorOutline, Verified } from '@mui/icons-material';
import api from '../../services/api';

const VerifyCertificate = () => {
    const { certificateId } = useParams();
    const [loading, setLoading] = useState(true);
    const [certificate, setCertificate] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get(`/certificates/verify/${certificateId}`);
                setCertificate(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Certificate not found or invalid.');
            } finally {
                setLoading(false);
            }
        };
        run();
    }, [certificateId]);

    return (
        <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Verified color="primary" />
                    <Typography variant="h5" fontWeight={900}>
                        Certificate Verification
                    </Typography>
                </Box>

                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Certificate ID: <strong>{certificateId}</strong>
                </Typography>

                {loading ? (
                    <>
                        <Skeleton variant="text" width="60%" height={34} />
                        <Skeleton variant="text" width="40%" />
                        <Skeleton variant="rounded" height={120} sx={{ mt: 3 }} />
                    </>
                ) : error ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 1 }} />
                        <Typography variant="h6" fontWeight={900} gutterBottom>
                            Invalid Certificate
                        </Typography>
                        <Typography color="text.secondary">{error}</Typography>
                    </Box>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6" fontWeight={900} gutterBottom>
                            Verified
                        </Typography>
                        <Chip
                            label="Authentic"
                            color="success"
                            sx={{ fontWeight: 800, mb: 3 }}
                        />

                        <Box sx={{ textAlign: 'left', maxWidth: 520, mx: 'auto' }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Student
                            </Typography>
                            <Typography fontWeight={800} sx={{ mb: 2 }}>
                                {certificate.student?.name || '—'}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                                Course
                            </Typography>
                            <Typography fontWeight={800} sx={{ mb: 2 }}>
                                {certificate.course?.title || '—'}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                                Issued On
                            </Typography>
                            <Typography fontWeight={800}>
                                {certificate.issuedAt ? new Date(certificate.issuedAt).toLocaleDateString() : '—'}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button variant="contained" href="/">
                        Go to LearnHub
                    </Button>
                    <Button variant="outlined" href="/courses">
                        Browse Courses
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default VerifyCertificate;

