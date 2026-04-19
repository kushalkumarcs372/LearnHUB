import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Link,
} from '@mui/material';
import AuthLayout from './AuthLayout';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login(formData);

            // Redirect based on role
            if (userData.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else if (userData.role === 'INSTRUCTOR') {
                navigate('/instructor/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome to LearnHub"
            subtitle="Sign in to continue learning"
            footer={
                <Typography variant="body2">
                    Don&apos;t have an account?{' '}
                    <Link component={RouterLink} to="/register" underline="hover">
                        Register here
                    </Link>
                </Typography>
            }
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    autoComplete="email"
                />
                <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    autoComplete="current-password"
                />
                <Box sx={{ mt: 1, textAlign: 'right' }}>
                    <Link component={RouterLink} to="/forgot-password" underline="hover">
                        Forgot password?
                    </Link>
                </Box>
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ mt: 3 }}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Login;
