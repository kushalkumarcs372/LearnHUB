import api from './api';

export const enrollmentService = {
    enrollInCourse: (courseId) => api.post(`/enrollments/enroll/${courseId}`),
    getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
    getCourseEnrollments: (courseId) => api.get(`/enrollments/course/${courseId}`),
    updateProgress: (enrollmentId, progressPercent) =>
        api.put(`/enrollments/${enrollmentId}/progress`, { progressPercent }),
};
