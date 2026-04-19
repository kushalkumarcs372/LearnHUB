import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { Home, MenuBook } from '@mui/icons-material';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
            <Paper sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', borderRadius: 4 }}>
                <Typography variant="h2" fontWeight={900} gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" fontWeight={800} gutterBottom>
                    Page not found
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 520, mx: 'auto' }}>
                    The page you’re looking for doesn’t exist or has moved.
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Button variant="contained" startIcon={<Home />} onClick={() => navigate('/')}>
                        Go Home
                    </Button>
                    <Button variant="outlined" startIcon={<MenuBook />} onClick={() => navigate('/courses')}>
                        Browse Courses
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default NotFound;

