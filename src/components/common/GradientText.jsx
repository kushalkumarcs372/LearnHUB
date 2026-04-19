import React from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const GradientText = ({ children, variant = 'h1', gradient = 'primary', ...props }) => {
    const theme = useTheme();
    const gradients = {
        primary: theme.custom?.gradients?.primary || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        gold: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    };

    return (
        <Typography
            variant={variant}
            sx={{
                background: gradients[gradient],
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
            }}
            {...props}
        >
            {children}
        </Typography>
    );
};

export default GradientText;
