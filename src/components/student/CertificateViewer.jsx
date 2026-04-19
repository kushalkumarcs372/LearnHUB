import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    CircularProgress,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
    EmojiEvents,
    Download,
    Share,
    Verified,
    CalendarToday,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../../services/api';

const CertificateViewer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const certificateRef = useRef();
    const [certificates, setCertificates] = useState([]);
    const [selectedCert, setSelectedCert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchCertificates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const fetchCertificates = async () => {
        try {
            const response = await api.get('/certificates/my-certificates');
            const certs = response.data || [];
            setCertificates(certs);

            const focusId = new URLSearchParams(location.search).get('certificateId');
            const match = focusId
                ? certs.find((c) => String(c.certificateId) === String(focusId))
                : null;
            setSelectedCert(match || certs[0] || null);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load certificates', err);
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`LearnHub_Certificate_${selectedCert.certificateId}.pdf`);
        } catch (err) {
            console.error('Failed to generate PDF', err);
            alert('Failed to download certificate');
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Certificate Design Component
    const CertificateDesign = ({ cert }) => (
        <Box
            ref={certificateRef}
            sx={{
                width: '210mm',
                height: '148.5mm',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                position: 'relative',
                overflow: 'hidden',
                p: 6,
                border: '20px solid',
                borderImage: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 50%, #f093fb 100%) 1`,
            }}
        >
            {/* Decorative Elements */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: (theme) =>
                        `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.16)} 0%, ${alpha(
                            theme.palette.secondary.main,
                            0.22
                        )} 100%)`,
                    filter: 'blur(40px)',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: -50,
                    left: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f093fb15 0%, #f5576c30 100%)',
                    filter: 'blur(40px)',
                }}
            />

            {/* Content */}
            <Box sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
                {/* Logo/Badge */}
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        margin: '0 auto 24px',
                        borderRadius: '50%',
                        background: (theme) => theme.custom?.gradients?.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
                    }}
                >
                    <EmojiEvents sx={{ fontSize: 50, color: 'white' }} />
                </Box>

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        textTransform: 'uppercase',
                        letterSpacing: 4,
                        color: '#64748b',
                        mb: 1,
                        fontWeight: 300,
                    }}
                >
                    Certificate of Completion
                </Typography>

                {/* Divider */}
                <Box
                    sx={{
                        width: 100,
                        height: 3,
                        background: (theme) => theme.custom?.gradients?.primary,
                        margin: '16px auto',
                    }}
                />

                {/* Student Name */}
                <Typography
                    variant="h2"
                    sx={{
                        fontFamily: '"Playfair Display", serif',
                        fontWeight: 700,
                        background: (theme) => theme.custom?.gradients?.primary,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 3,
                    }}
                >
                    {cert.student.name}
                </Typography>

                {/* Description */}
                <Typography
                    variant="body1"
                    sx={{
                        color: '#475569',
                        mb: 2,
                        fontSize: '1.1rem',
                        maxWidth: '80%',
                        margin: '0 auto 24px',
                    }}
                >
                    has successfully completed the course
                </Typography>

                {/* Course Name */}
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        color: '#1e293b',
                        mb: 4,
                    }}
                >
                    {cert.course.title}
                </Typography>

                {/* Footer Info */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        mt: 4,
                        pt: 3,
                        borderTop: '2px solid #e2e8f0',
                    }}
                >
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Completed On
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {new Date(cert.completionDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Certificate ID
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                            {cert.certificateId}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Instructor
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                            {cert.course.instructor.name}
                        </Typography>
                    </Box>
                </Box>

                {/* Signature Line */}
                <Box
                    sx={{
                        mt: 4,
                        pt: 2,
                        borderTop: '1px solid #cbd5e1',
                        width: 200,
                        margin: '32px auto 0',
                    }}
                >
                    <Typography variant="caption" color="text.secondary">
                        LearnHub Platform
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    My Certificates 🏆
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Download and share your achievements
                </Typography>
            </Box>

            {certificates.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3 }}>
                    <EmojiEvents sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No certificates yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Complete a course to earn your first certificate!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/courses')}
                        sx={{ mt: 2 }}
                    >
                        Browse Courses
                    </Button>
                </Paper>
            ) : (
                <>
                    {/* Certificate List */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {certificates.map((cert, index) => (
                            <Grid item xs={12} md={6} lg={4} key={cert.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            cursor: 'pointer',
                                            transition:
                                                'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-8px)',
                                                boxShadow: (theme) => theme.custom?.shadows?.cardHover,
                                            },
                                        }}
                                        onClick={() => setSelectedCert(cert)}
                                    >
                                        <Box
                                            sx={{
                                                height: 120,
                                                background: (theme) => theme.custom?.gradients?.primary,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <EmojiEvents sx={{ fontSize: 60, color: 'white' }} />
                                        </Box>
                                        <CardContent>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom noWrap>
                                                {cert.course.title}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(cert.completionDate).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                icon={<Verified />}
                                                label={cert.certificateId}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                            />
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Certificate Preview & Download */}
                    {selectedCert && (
                        <Paper sx={{ p: 4, borderRadius: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5" fontWeight="bold">
                                    Certificate Preview
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Share />}
                                        onClick={() => {
                                            navigator.clipboard.writeText(
                                                `${window.location.origin}/certificates/verify/${selectedCert.certificateId}`
                                            );
                                            alert('Certificate link copied to clipboard!');
                                        }}
                                    >
                                        Share
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={downloading ? <CircularProgress size={20} /> : <Download />}
                                        onClick={handleDownloadPDF}
                                        disabled={downloading}
                                        sx={{
                                            background: (theme) => theme.custom?.gradients?.primary,
                                        }}
                                    >
                                        {downloading ? 'Generating PDF...' : 'Download PDF'}
                                    </Button>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    overflow: 'auto',
                                    p: 2,
                                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : '#f8fafc'),
                                    borderRadius: 2,
                                }}
                            >
                                <CertificateDesign cert={selectedCert} />
                            </Box>
                        </Paper>
                    )}
                </>
            )}
        </Container>
    );
};

export default CertificateViewer;
