import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Typography,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Chip,
    InputAdornment,
    Fade,
    Skeleton,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import CourseCard from './CourseCard';
import { courseService } from '../../services/courseService';
import { motion } from 'framer-motion';

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await courseService.getAllCourses();
            setCourses(response.data);
            setAllCourses(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load courses');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await courseService.getAllCategories();
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        filterCourses(query, selectedCategory);
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        const categoryId = value === '' ? '' : Number(value);
        setSelectedCategory(categoryId);
        filterCourses(searchQuery, categoryId);
    };

    const filterCourses = (search, category) => {
        let filtered = allCourses;

        if (search.trim()) {
            filtered = filtered.filter((course) =>
                course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.description?.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category) {
            filtered = filtered.filter((course) => String(course.category?.id) === String(category));
        }

        setCourses(filtered);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('');
        setCourses(allCourses);
    };

    return (
        <>
            {/* Hero Section */}
            <Box
                sx={{
                    background: (theme) => theme.custom?.gradients?.primary,
                    color: 'white',
                    py: 8,
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Typography variant="h2" fontWeight="bold" gutterBottom>
                            Explore Our Courses
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                            {loading ? (
                                <Skeleton width={360} sx={{ bgcolor: 'rgba(255,255,255,0.25)' }} />
                            ) : (
                                <>
                                    Choose from {allCourses.length}+ courses - All FREE! Pay only for 1-on-1 doubt sessions.
                                </>
                            )}
                        </Typography>
                    </motion.div>
                </Container>

                {/* Decorative circles */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        filter: 'blur(40px)',
                    }}
                />
            </Box>

            <Container maxWidth="lg" sx={{ mt: -4, mb: 6, position: 'relative', zIndex: 10 }}>
                {/* Search and Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                >
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 3,
                            boxShadow: (theme) => theme.custom?.shadows?.card,
                            mb: 4,
                        }}
                    >
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    placeholder="Search for courses..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    disabled={loading}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        onChange={handleCategoryChange}
                                        label="Category"
                                        sx={{ borderRadius: 2 }}
                                        disabled={loading}
                                    >
                                        <MenuItem value="">All Categories</MenuItem>
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={2}>
                                {(searchQuery || selectedCategory) && (
                                    <Chip
                                        label="Clear Filters"
                                        onClick={clearFilters}
                                        onDelete={clearFilters}
                                        color="primary"
                                        sx={{ width: '100%', height: 56 }}
                                    />
                                )}
                            </Grid>
                        </Grid>
                    </Box>
                </motion.div>

                {error && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                        {error}
                    </Alert>
                )}

                {/* Results Count */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        {loading ? (
                            <Skeleton width={180} />
                        ) : (
                            <>
                                {courses.length} {courses.length === 1 ? 'Course' : 'Courses'} Found
                            </>
                        )}
                    </Typography>
                    {selectedCategory && (
                        <Chip
                            label={categories.find((c) => String(c.id) === String(selectedCategory))?.name}
                            onDelete={clearFilters}
                            color="primary"
                            variant="outlined"
                        />
                    )}
                </Box>

                {/* Course Grid */}
                {loading ? (
                    <Grid container spacing={3}>
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Box
                                    sx={{
                                        bgcolor: 'background.paper',
                                        borderRadius: 3,
                                        overflow: 'hidden',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <Skeleton variant="rectangular" height={200} />
                                    <Box sx={{ p: 3 }}>
                                        <Skeleton height={28} width="85%" />
                                        <Skeleton height={18} width="95%" />
                                        <Skeleton height={18} width="70%" sx={{ mb: 2 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                                            <Skeleton variant="rounded" height={36} width={90} />
                                            <Skeleton variant="rounded" height={36} width={120} />
                                        </Box>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Fade in={!loading}>
                        <Grid container spacing={3}>
                            {courses.length === 0 ? (
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            textAlign: 'center',
                                            py: 8,
                                            bgcolor: 'background.paper',
                                            borderRadius: 3,
                                            boxShadow: (theme) => theme.custom?.shadows?.card,
                                        }}
                                    >
                                        <Typography variant="h5" color="text.secondary" gutterBottom>
                                            No courses found
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            Try adjusting your filters or search terms
                                        </Typography>
                                    </Box>
                                </Grid>
                            ) : (
                                courses.map((course, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                        >
                                            <CourseCard course={course} />
                                        </motion.div>
                                    </Grid>
                                ))
                            )}
                        </Grid>
                    </Fade>
                )}
            </Container>
        </>
    );
};

export default CourseCatalog;
