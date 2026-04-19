import React from 'react';
import { Card } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { motion, useReducedMotion } from 'framer-motion';

const GlassCard = ({ children, sx, ...props }) => {
    const theme = useTheme();
    const prefersReducedMotion = useReducedMotion();

    return (
        <motion.div
            whileHover={prefersReducedMotion ? undefined : { y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card
                sx={{
                    background: theme.custom?.gradients?.glass,
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${alpha('#ffffff', theme.palette.mode === 'dark' ? 0.10 : 0.28)}`,
                    boxShadow: theme.custom?.shadows?.card,
                    ...sx,
                }}
                {...props}
            >
                {children}
            </Card>
        </motion.div>
    );
};

export default GlassCard;
