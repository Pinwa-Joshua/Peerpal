const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE_URL = "http://localhost:8000/api";

const apiCall = async (endpoint, options = {}) => {
    if (!API_BASE_URL) throw new Error("API base URL is not defined.");

    const token = localStorage.getItem("access_token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const config = {
        ...options,
        headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || err.error || `HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? null : await response.json();
};

export const UsersAPI = {
    updateProfile: (data) => apiCall('/users/update-profile', { method: 'PUT', body: JSON.stringify(data) })
};

export const FinanceAPI = {
    getWallet: () => apiCall('/finance/wallet'),
    topupWallet: (amount) => apiCall('/finance/wallet/topup', { method: 'POST', body: JSON.stringify({ amount }) }),
    getEarnings: () => apiCall('/finance/earnings'),
    withdrawFunds: (amount) => apiCall('/finance/earnings/withdraw', { method: 'POST', body: JSON.stringify({ amount }) })
};

export const AuthAPI = {
    login: async (credentials) => {
        return await apiCall('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
    },
    register: async (userDetails) => {
        return await apiCall('/auth/register', { method: 'POST', body: JSON.stringify(userDetails) });
    },
    getMe: async () => {
        return await apiCall('/auth/me', { method: 'GET' });
    }
};

export const TutorAPI = {
    getTutors: () => apiCall('/tutors/', { method: 'GET' }),
    getAll: async (subject = '') => {
        const base = '/tutors/';
        return await apiCall(subject ? `${base}?subject=${subject}` : base);
    },
    updateTutorProfile: (data) => apiCall('/tutors/update', { method: 'PUT', body: JSON.stringify(data) }),
    createProfile: async (profile) => apiCall('/tutors/create', { method: 'POST', body: JSON.stringify(profile) }),
    getAvailability: async () => apiCall('/tutors/availability', { method: 'GET' }),
    updateAvailability: async (availability) => apiCall('/tutors/availability', { method: 'PUT', body: JSON.stringify(availability) })
};

export const MatchesAPI = {
    recommendMatch: (data) => apiCall('/matches/recommend', { method: 'POST', body: JSON.stringify(data) }),
    createSession: async (tutor_id) => apiCall('/sessions/create', { method: 'POST', body: JSON.stringify({ tutor_id }) }),
    recommendTutor: async (data = {}) => apiCall('/matches/recommend', { method: 'POST', body: JSON.stringify(data) }),
    getMySessions: async () => apiCall('/sessions/'),
    getSessions: async (status = '') => {
        return await apiCall(status ? `/sessions/?status=${status}` : '/sessions/');
    },
    acceptSession: async (id) => apiCall(`/sessions/${id}/accept`, { method: "POST" }),
    rejectSession: async (id) => apiCall(`/sessions/${id}/reject`, { method: "POST" })
};

export const MessagesAPI = {
    getInbox: async () => apiCall('/messages/inbox', { method: 'GET' }),
    getThread: async (userId) => apiCall(`/messages/thread/${userId}`, { method: 'GET' }),
    sendMessage: async (receiverId, content) => apiCall('/messages/send', { method: 'POST', body: JSON.stringify({ receiver_id: receiverId, content }) })
};

export const ProgressAPI = {
    getOverview: async () => apiCall('/progress/'),
    getQuiz: async (subject) => apiCall(`/progress/quiz?subject=${subject}`),
    submitQuiz: async (quizId, answers) => apiCall('/progress/quiz/submit', { method: 'POST', body: JSON.stringify({ quizId, answers }) })
};
export const NotificationsAPI = {
    getUnread: async () => apiCall('/notifications/unread'),
    markAsRead: async (id) => apiCall(`/notifications/${id}/read`, { method: 'POST' }),
    markAllAsRead: async () => apiCall('/notifications/read-all', { method: 'POST' })
};

// Trigger HMR

