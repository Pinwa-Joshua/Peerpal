// MOCKED API SERVICE for Frontend-Only Development
// Replaces actual HTTP requests with mock data to unblock frontend development.

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

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

    // Handles scenarios like 204 No Content
    return response.status === 204 ? null : await response.json();
};

const mockUser = {
    id: 1,
    name: "Demo User",
    email: "demo@example.com",
    role: "student", // or "tutor"
};

const mockTutors = [
    { id: 1, name: "Zanele D.", initials: "ZD", gradient: "from-yellow-400 to-orange-500", university: "University of Cape Town", subjects: ["Linear Algebra", "Calculus I", "Calculus II"], rating: 4.9, reviews: 42, rate: 120, format: "both", active: "2 hrs ago", bio: "Experienced math tutor." },
    { id: 2, name: "Sipho N.", initials: "SN", gradient: "from-cyan-500 to-blue-600", university: "University of the Witwatersrand", subjects: ["Chemistry 101", "Organic Chemistry"], rating: 4.8, reviews: 35, rate: 100, format: "online", active: "Online now", bio: "Chemistry enthusiast." },
    { id: 3, name: "Amara L.", initials: "AL", gradient: "from-violet-500 to-purple-600", university: "Stellenbosch University", subjects: ["Statistics 101", "Economics 101"], rating: 4.7, reviews: 28, rate: 90, format: "in-person", active: "1 hr ago", bio: "Economics expert." },
    { id: 4, name: "Thabo M.", initials: "TM", gradient: "from-blue-500 to-indigo-600", university: "University of Pretoria", subjects: ["Calculus II", "Physics I", "Physics II"], rating: 4.9, reviews: 56, rate: 150, format: "both", active: "Online now", bio: "Top physics tutor." },
    { id: 5, name: "Naledi K.", initials: "NK", gradient: "from-pink-500 to-rose-600", university: "University of KwaZulu-Natal", subjects: ["Biology 101", "Anatomy & Physiology"], rating: 4.6, reviews: 19, rate: 80, format: "in-person", active: "3 hrs ago", bio: "Pre-med focused tutor." }
];

const mockSessions = [
    { id: 1, tutorName: "Alice Johnson", subject: "Math", date: "2026-03-25", status: "upcoming" },
    { id: 2, tutorName: "Bob Smith", subject: "Physics", date: "2026-03-20", status: "completed" }
];

export const AuthAPI = {
    login: async (credentials) => {
        await delay(500);
        if (credentials.email && credentials.password) {
            // Keep track of role for testing: check if email contains 'admin' or 'tutor'
            let mockRole = "student";
            if (credentials.email.toLowerCase().includes('admin')) {
                mockRole = "admin";
            } else if (credentials.role) {
                mockRole = credentials.role;
            } else if (credentials.email.toLowerCase().includes('tutor')) {
                mockRole = "tutor";
            }

            localStorage.setItem('mock_role', mockRole);
            return { access_token: "mock-jwt-token-12345" };
        }
        throw new Error("Invalid credentials");
    },
    register: async (userDetails) => {
        await delay(500);
        localStorage.setItem('mock_role', userDetails.role === 'tutee' ? 'student' : userDetails.role);
        return { message: "User registered successfully", user: { ...mockUser, ...userDetails } };
    },
    getMe: async () => {
        await delay(300);
        const token = localStorage.getItem('access_token');
        if (!token) throw new Error("Unauthorized");
        const role = localStorage.getItem('mock_role') || 'student';
        return { ...mockUser, role };
    },
};

export const TutorAPI = {
    getAll: async (subject = '') => {
        await delay(600);
        if (subject) {
            return mockTutors.filter(t => t.subject.toLowerCase().includes(subject.toLowerCase()));
        }
        return mockTutors;
    },
    createProfile: async (profile) => {
        await delay(500);
        return { message: "Profile created", profile: { id: 999, ...profile } };
    },
    getAvailability: async () => {
        if (API_BASE_URL) {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/tutors/availability`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch availability");
            }

            return data;
        }

        // Fallback for mocked mode
        await delay(400);
        return [];
    },
    updateAvailability: async (availability) => {
        if (API_BASE_URL) {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/tutors/availability`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(availability),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "Failed to update availability");
            }

            return data;
        }

        // Fallback for mocked mode
        await delay(400);
        return { message: "Availability updated successfully" };
    }
};

export const MatchesAPI = {
    createSession: async (tutor_id) => {
        await delay(500);
        const tutor = mockTutors.find(t => t.id === parseInt(tutor_id)) || mockTutors[0];
        const newSession = {
            id: Date.now(),
            tutorName: tutor.name,
            subject: tutor.subject,
            date: new Date().toISOString().split('T')[0],
            status: "upcoming"
        };
        mockSessions.push(newSession);
        return { message: "Session requested", session: newSession };
    },
    recommendTutor: async ({
        subject,
        subject_id = null,
        prefer_same_university = false,
    } = {}) => {
        if (!subject) {
            throw new Error("A subject is required to find a tutor match.");
        }

        if (API_BASE_URL) {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/matches/recommend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    subject,
                    subject_id,
                    prefer_same_university,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || "Match not created");
            }

            return data;
        }

        await delay(700);
        const normalizedSubject = subject.toLowerCase();
        const matchedTutor = mockTutors.find((tutor) =>
            tutor.subjects.some((entry) => entry.toLowerCase().includes(normalizedSubject))
        );
        if (!matchedTutor) {
            return { message: "No tutor found for the selected subject." };
        }
        return { message: "Match successful!", tutor: matchedTutor };
    },
    getMySessions: async () => {
        await delay(400);
        return mockSessions;
    },
    getSessions: async (status = '') => {
        try {
            return await apiCall(`/api/sessions/?status=${status}`);
        } catch (error) {
            console.warn("Fallback to mock for getSessions:", error.message);
            await delay(400);
            return status ? mockSessions.filter(s => s.status === status) : mockSessions;
        }
    },
    acceptSession: async (id) => {
        return await apiCall(`/api/sessions/${id}/accept`, { method: "POST" });
    },
    rejectSession: async (id) => {
        return await apiCall(`/api/sessions/${id}/reject`, { method: "POST" });
    }
};

export const MessagesAPI = {
    getInbox: async () => {
        if (API_BASE_URL) {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/messages/inbox`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            });
            if (!response.ok) throw new Error("Failed to fetch inbox");
            return response.status === 204 ? [] : await response.json();
        }
        await delay(400);
        return [];
    },
    getThread: async (userId) => {
        if (API_BASE_URL) {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/messages/thread/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                }
            });
            if (!response.ok) throw new Error("Failed to fetch thread");
            return response.status === 204 ? [] : await response.json();
        }
        await delay(400);
        return [];
    },
    sendMessage: async (receiverId, content) => {
        if (API_BASE_URL) {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/messages/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ receiver_id: receiverId, content }),
            });
            if (!response.ok) throw new Error("Failed to send message");
            return await response.json();
        }
        await delay(300);
        return { message: "Message sent mock" };
    }
};

export const NotificationsAPI = {
    getNotifications: async () => {
        try {
            return await apiCall(`/api/notifications/`);
        } catch (error) {
            console.warn("Fallback to mock for getNotifications:", error.message);
            return []; // Mock fallback
        }
    },
    markAsRead: async (id) => {
        try {
            return await apiCall(`/api/notifications/${id}/read`, { method: "PUT" });
        } catch (error) {
            console.warn("Fallback to mock for markAsRead:", error.message);
            return { message: "Marked as read (mock)" };
        }
    }
};

