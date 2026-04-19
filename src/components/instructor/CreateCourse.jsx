import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import { courseService } from '../../services/courseService';

const CreateCourse = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        categoryId: '',
        price: 0,
    });

    const steps = ['Course Details', 'Review & Create'];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setCategoriesLoading(true);
            const response = await courseService.getAllCategories();
            setCategories(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error('Failed to load categories', err);
            setCategories([]);
        }
        finally {
            setCategoriesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseData({
            ...courseData,
            [name]:
                name === 'categoryId'
                    ? (value === '' ? '' : Number(value))
                    : name === 'price'
                        ? Number(value)
                        : value,
        });
    };

    const handleNext = () => {
        if (activeStep === 0) {
            // Validate step 1
            if (!courseData.title.trim()) {
                setError('Course title is required');
                return;
            }
            if (!courseData.description.trim()) {
                setError('Course description is required');
                return;
            }
            if (!courseData.categoryId) {
                setError('Please select a category');
                return;
            }
        }
        setError('');
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await courseService.createCourse(courseData);
            alert('Course created successfully!');
            navigate(`/instructor/courses/${response.data.id}/edit`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Create New Course
                </Typography>

                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {activeStep === 0 && (
                    <Box>
                        <TextField
                            fullWidth
                            label="Course Title"
                            name="title"
                            value={courseData.title}
                            onChange={handleChange}
                            margin="normal"
                            required
                            placeholder="e.g., Complete Web Development Bootcamp"
                        />

                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={courseData.description}
                            onChange={handleChange}
                            margin="normal"
                            required
                            multiline
                            rows={4}
                            placeholder="Describe what students will learn in this course..."
                        />

                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="categoryId"
                                value={courseData.categoryId}
                                onChange={handleChange}
                                label="Category"
                            >
                                {categoriesLoading && (
                                    <MenuItem disabled value="">
                                        Loading categories...
                                    </MenuItem>
                                )}
                                {!categoriesLoading && categories.length === 0 && (
                                    <MenuItem disabled value="">
                                        No categories found
                                    </MenuItem>
                                )}
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Price (Set to 0 for free)"
                            name="price"
                            type="number"
                            value={courseData.price}
                            onChange={handleChange}
                            margin="normal"
                            InputProps={{ inputProps: { min: 0 } }}
                            helperText="Course content is free. Students pay only for 1-on-1 doubt sessions."
                        />
                    </Box>
                )}

                {activeStep === 1 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Review Course Details
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                                Title
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {courseData.title}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                                Description
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {courseData.description}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                                Category
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {categories.find((c) => String(c.id) === String(courseData.categoryId))?.name || 'N/A'}
                            </Typography>

                            <Typography variant="subtitle2" color="text.secondary">
                                Price
                            </Typography>
                            <Typography variant="body1">
                                {courseData.price === 0 ? 'Free' : `₹${courseData.price}`}
                            </Typography>
                        </Box>
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>
                    <Box>
                        {activeStep === steps.length - 1 ? (
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Course'}
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleNext}>
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateCourse;
