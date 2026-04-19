// In development, CRA proxy can forward `/api/*` to your backend (see `package.json.proxy`).
// In production (Vercel), set `REACT_APP_API_BASE_URL` to your deployed backend URL, e.g. `https://your-backend.com/api`.
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const ROLES = {
    STUDENT: 'STUDENT',
    INSTRUCTOR: 'INSTRUCTOR',
    ADMIN: 'ADMIN'
};

export const COURSE_STATUS = {
    DRAFT: 'DRAFT',
    PUBLISHED: 'PUBLISHED',
    ARCHIVED: 'ARCHIVED'
};
