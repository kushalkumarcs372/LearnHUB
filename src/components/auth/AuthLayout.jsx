import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import GradientText from '../common/GradientText';

const AuthLayout = ({ title, subtitle, children, footer }) => {
    return (
        <Container maxWidth="sm">
            <Box sx={{ py: { xs: 6, md: 10 } }}>
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                    <GlassCard
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: 4,
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <GradientText variant="h3" gradient="primary" sx={{ fontWeight: 900 }}>
                                {title}
                            </GradientText>
                            {subtitle ? (
                                <Typography color="text.secondary" sx={{ mt: 1 }}>
                                    {subtitle}
                                </Typography>
                            ) : null}
                        </Box>

                        {children}

                        {footer ? <Box sx={{ mt: 3, textAlign: 'center' }}>{footer}</Box> : null}
                    </GlassCard>
                </motion.div>
            </Box>
        </Container>
    );
};

export default AuthLayout;

