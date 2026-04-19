import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    TextField,
    Button,
    Typography,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Link,
} from '@mui/material';
import { ROLES } from '../../utils/constants';
import AuthLayout from './AuthLayout';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'STUDENT',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
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

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const userData = await register(registerData);

            // Redirect based on role
            if (userData.role === 'STUDENT') {
                navigate('/student/dashboard');
            } else if (userData.role === 'INSTRUCTOR') {
                navigate('/instructor/dashboard');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Join LearnHub"
            subtitle="Create your account to start learning"
            footer={
                <Typography variant="body2">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login" underline="hover">
                        Sign in here
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
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                    autoComplete="name"
                />
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
                    autoComplete="new-password"
                />
                <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                    autoComplete="new-password"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>I am a</InputLabel>
                    <Select name="role" value={formData.role} onChange={handleChange} label="I am a">
                        <MenuItem value={ROLES.STUDENT}>Student</MenuItem>
                        <MenuItem value={ROLES.INSTRUCTOR}>Instructor</MenuItem>
                    </Select>
                </FormControl>

                <Button fullWidth type="submit" variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Register;
