import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ProgressAnalytics = () => {
    const theme = useTheme();
    const [stats, setStats] = useState({
        weeklyProgress: [],
        courseDistribution: [],
        quizPerformance: [],
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        // Fetch your analytics data from backend
        // For now using mock data
        setStats({
            weeklyProgress: [
                { day: 'Mon', hours: 2 },
                { day: 'Tue', hours: 3 },
                { day: 'Wed', hours: 1.5 },
                { day: 'Thu', hours: 4 },
                { day: 'Fri', hours: 2.5 },
                { day: 'Sat', hours: 5 },
                { day: 'Sun', hours: 3 },
            ],
            courseDistribution: [
                { name: 'Completed', value: 5, color: '#10b981' },
                { name: 'In Progress', value: 3, color: '#f59e0b' },
                { name: 'Not Started', value: 2, color: '#ef4444' },
            ],
            quizPerformance: [
                { quiz: 'Quiz 1', score: 85 },
                { quiz: 'Quiz 2', score: 92 },
                { quiz: 'Quiz 3', score: 78 },
                { quiz: 'Quiz 4', score: 95 },
            ],
        });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Learning Analytics 📊
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {/* Weekly Study Hours */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Weekly Study Hours
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats.weeklyProgress}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="hours"
                                    stroke={theme.palette.primary.main}
                                    strokeWidth={3}
                                    dot={{ fill: theme.palette.primary.main, r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Course Distribution */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Course Status
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.courseDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {stats.courseDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Quiz Performance */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quiz Performance
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats.quizPerformance}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="quiz" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="score" fill={theme.palette.primary.main} radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProgressAnalytics;
