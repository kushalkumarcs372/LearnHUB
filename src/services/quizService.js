import api from './api';

export const quizService = {
    getCourseQuizzes: (courseId) => api.get(`/quizzes/course/${courseId}`),
    getQuizById: (id) => api.get(`/quizzes/${id}`),
    createQuiz: (quizData) => api.post('/quizzes', quizData),
    updateQuiz: (id, quizData) => api.put(`/quizzes/${id}`, quizData),
    deleteQuiz: (id) => api.delete(`/quizzes/${id}`),
    submitQuizAttempt: (attemptData) => api.post('/quiz-attempts/submit', attemptData),
    getMyQuizAttempts: (quizId) => api.get(`/quiz-attempts/quiz/${quizId}/my-attempts`),
    getAllMyAttempts: () => api.get('/quiz-attempts/my-attempts'),
    hasPassedQuiz: (quizId) => api.get(`/quiz-attempts/quiz/${quizId}/has-passed`),
};