import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { alpha, useTheme } from '@mui/material/styles';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    borderRadius: 3,
                    borderColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.12 : 0.06),
                    transition:
                        'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                    '&:hover': {
                        boxShadow: theme.custom?.shadows?.cardHover,
                        borderColor: alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.22 : 0.10),
                        '& .course-image': {
                            transform: 'scale(1.05)',
                        },
                        '& .view-btn': {
                            background: theme.custom?.gradients?.primary,
                            color: 'white',
                        },
                    },
                }}
                onClick={() => navigate(`/courses/${course.id}`)}
            >
                {/* FREE Badge */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 2,
                        background: (theme) => theme.custom?.gradients?.success,
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '0.875rem',
                        boxShadow: (theme) =>
                            theme.palette.mode === 'dark'
                                ? '0 10px 28px rgba(0,0,0,0.55)'
                                : '0 4px 12px rgba(67, 233, 123, 0.40)',
                    }}
                >
                    FREE
                </Box>

                <Box sx={{ position: 'relative', overflow: 'hidden', height: 200 }}>
                    <CardMedia
                        component="img"
                        height="200"
                        image={course.imageUrl || `https://source.unsplash.com/800x400/?course,${course.category?.name || 'education'}`}
                        alt={course.title}
                        className="course-image"
                        sx={{
                            transition: 'transform 0.5s ease',
                            objectFit: 'cover',
                        }}
                    />
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            p: 2,
                        }}
                    >
                        {course.category && (
                            <Chip
                                label={course.category.name}
                                size="small"
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.9)',
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    backdropFilter: 'blur(10px)',
                                }}
                            />
                        )}
                    </Box>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            mb: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: 64,
                        }}
                    >
                        {course.title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            minHeight: 40,
                        }}
                    >
                        {course.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: theme.palette.primary.main }}>
                                {(course.instructor?.name || 'I').charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary" noWrap>
                                {course.instructor?.name || 'Instructor'}
                            </Typography>
                        </Box>
                        <Chip
                            size="small"
                            label="1-on-1 sessions"
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.18 : 0.10),
                                color: theme.palette.primary.main,
                                fontWeight: 700,
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" color="primary">
                                FREE
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                + 1-on-1 Sessions
                            </Typography>
                        </Box>
                    <Button
                        variant="outlined"
                        size="medium"
                        className="view-btn"
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                            transition:
                                'transform 220ms cubic-bezier(0.16, 1, 0.3, 1), background-color 220ms cubic-bezier(0.16, 1, 0.3, 1), color 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${course.id}`);
                            }}
                        >
                            View Details
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CourseCard;
