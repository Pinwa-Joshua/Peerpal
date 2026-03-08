const BASE_URL = 'http://127.0.0.1:8000/api'; // Make sure this matches your Flask backend port + prefix

export const apiCall = async (endpoint, options = {}) => {
    const token = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid, handle auto-logout here if needed
            localStorage.removeItem('access_token');
        }
        throw new Error(data.detail || data.message || data.error || 'Something went wrong');
    }

    return data;
};

// API Route helpers
export const AuthAPI = {
    login: (credentials) => apiCall('/users/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userDetails) => apiCall('/users/register', { method: 'POST', body: JSON.stringify(userDetails) }),
    getMe: () => apiCall('/users/me', { method: 'GET' }),
};

export const TutorAPI = {
    getAll: (subject = '') => apiCall(`/tutors?subject=${subject}`, { method: 'GET' }),
    createProfile: (profile) => apiCall('/tutors/profile', { method: 'POST', body: JSON.stringify(profile) })
};

export const MatchesAPI = {
    createSession: (tutor_id) => apiCall(`/matches/create?tutor_id=${tutor_id}`, { method: 'POST' }),
    getMySessions: () => apiCall('/matches/my-sessions', { method: 'GET' })
};
