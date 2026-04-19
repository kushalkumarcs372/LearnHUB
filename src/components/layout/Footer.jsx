import React from 'react';
import { Box, Container, Link, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                mt: 'auto',
                background: (theme) =>
                    theme.palette.mode === 'dark'
                        ? theme.custom?.gradients?.glass
                        : 'linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.90) 100%)',
                backdropFilter: 'blur(12px)',
                borderTop: (theme) => `1px solid ${alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.10 : 0.08)}`,
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} LearnHub — Your gateway to learning with personalized guidance.
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    <Link href="#" color="inherit" underline="hover">
                        Privacy Policy
                    </Link>
                    {' • '}
                    <Link href="#" color="inherit" underline="hover">
                        Terms
                    </Link>
                    {' • '}
                    <Link href="#" color="inherit" underline="hover">
                        Contact
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
