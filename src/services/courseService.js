import api from './api';

export const courseService = {
    // Public endpoints
    getAllCourses: () => api.get('/courses/public'),
    getCourseById: (id) => api.get(`/courses/public/${id}`),
    searchCourses: (title) => api.get(`/courses/public/search?title=${title}`),
    getCoursesByCategory: (categoryId) => api.get(`/courses/public/category/${categoryId}`),
    // Add this line
    getCourseEnrollments: (courseId) => api.get(`/enrollments/course/${courseId}`),

    // Instructor endpoints
    createCourse: (courseData) => api.post('/courses', courseData),
    updateCourse: (id, courseData) => api.put(`/courses/${id}`, courseData),
    publishCourse: (id) => api.put(`/courses/${id}/publish`),
    deleteCourse: (id) => api.delete(`/courses/${id}`),
    getMyCourses: () => api.get('/courses/instructor/my-courses'),

    // Lectures
    getCourseLectures: (courseId) => api.get(`/lectures/course/${courseId}`),
    createLecture: (lectureData) => api.post('/lectures', lectureData),
    updateLecture: (id, lectureData) => api.put(`/lectures/${id}`, lectureData),
    deleteLecture: (id) => api.delete(`/lectures/${id}`),

    // Materials
    getCourseMaterials: (courseId) => api.get(`/materials/course/${courseId}`),
    createMaterial: (materialData) => api.post('/materials', materialData),

    // Categories
    getAllCategories: () => api.get('/categories'),
    createCategory: (categoryData) => api.post('/categories', categoryData),
};