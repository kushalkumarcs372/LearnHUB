import api from './api';

export const guideService = {
    // Student endpoints
    createGuideRequest: (requestData) => api.post('/guide-requests', requestData),
    bookPaidSession: (bookingData) => api.post('/guide-requests/book-session', bookingData),
    getMyRequests: () => api.get('/guide-requests/my-requests'),
    cancelRequest: (requestId) => api.delete(`/guide-requests/${requestId}`),

    // Instructor endpoints
    getInstructorRequests: () => api.get('/guide-requests/instructor/requests'),
    getPendingRequests: () => api.get('/guide-requests/instructor/pending'),
    getPendingCount: () => api.get('/guide-requests/instructor/pending-count'),
    respondToRequest: (requestId, responseData) =>
        api.put(`/guide-requests/${requestId}/respond`, responseData),

    // Sessions
    scheduleSession: (sessionData) => api.post('/guide-sessions/schedule', sessionData),
    getMySessions: () => api.get('/guide-sessions/my-sessions'),
    getInstructorSessions: () => api.get('/guide-sessions/instructor/sessions'),
    updateSessionStatus: (sessionId, statusData) =>
        api.put(`/guide-sessions/${sessionId}/status`, statusData),
};
