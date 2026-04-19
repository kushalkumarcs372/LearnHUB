import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    Link,
} from '@mui/material';
import api from '../../services/api';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');

    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const steps = ['Request Token', 'Reset Password'];

    const handleRequestToken = async () => {
        setLoading(true);
        setError('');
        setInfo('');
        try {
            const res = await api.post('/auth/password-reset/request', { email });
            const resetToken = res?.data?.resetToken;
            setInfo(res?.data?.message || 'If the email exists, a reset token has been generated.');
            if (resetToken) {
                setToken(resetToken);
            }
            setActiveStep(1);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request reset token');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReset = async () => {
        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');
        setInfo('');
        try {
            const res = await api.post('/auth/password-reset/confirm', {
                token,
                newPassword,
            });
            setInfo(res?.data?.message || 'Password reset successful. You can now log in.');
            setTimeout(() => navigate('/login'), 800);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Request a reset token and set a new password."
            footer={
                <Typography variant="body2">
                    Remembered your password?{' '}
                    <Link component={RouterLink} to="/login" underline="hover">
                        Back to login
                    </Link>
                </Typography>
            }
        >
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {info && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {info}
                </Alert>
            )}

            {activeStep === 0 ? (
                <>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        margin="normal"
                        required
                        autoComplete="email"
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                        disabled={loading || !email}
                        onClick={handleRequestToken}
                    >
                        {loading ? 'Requesting...' : 'Request Token'}
                    </Button>
                </>
            ) : (
                <>
                    <TextField
                        fullWidth
                        label="Reset Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        margin="normal"
                        required
                        helperText="In this demo, the token is shown after requesting. In production, it would be emailed."
                    />
                    <TextField
                        fullWidth
                        label="New Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        margin="normal"
                        required
                        autoComplete="new-password"
                    />
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        margin="normal"
                        required
                        autoComplete="new-password"
                    />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button fullWidth variant="outlined" disabled={loading} onClick={() => setActiveStep(0)}>
                            Back
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            disabled={loading || !token || !newPassword || !confirmPassword}
                            onClick={handleConfirmReset}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </Box>
                </>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
