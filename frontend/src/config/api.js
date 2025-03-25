const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`,
        me: `${API_BASE_URL}/auth/me`,
        logout: `${API_BASE_URL}/auth/logout`
    },
    tasks: {
        list: `${API_BASE_URL}/tasks`,
        create: `${API_BASE_URL}/tasks`,
        update: (id) => `${API_BASE_URL}/tasks/${id}`,
        delete: (id) => `${API_BASE_URL}/tasks/${id}`
    },
    academic: {
        homework: `${API_BASE_URL}/academic/homework`,
        deadlines: `${API_BASE_URL}/academic/deadlines`,
        exams: `${API_BASE_URL}/academic/exams`
    },
    subjects: {
        list: (userId) => `${API_BASE_URL}/subjects/${userId}`,
        add: `${API_BASE_URL}/subjects/add`,
        delete: (subjectId) => `${API_BASE_URL}/subjects/delete/${subjectId}`,
    },
    friends: {
        list: (userId) => `${API_BASE_URL}/users/${userId}/friends`,
        add: `${API_BASE_URL}/friends`,
        remove: (friendId) => `${API_BASE_URL}/friends/${friendId}`
    },
    habits: {
        add: `${API_BASE_URL}/habits/add`,
    }
}; 