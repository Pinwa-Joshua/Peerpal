// MOCKED API SERVICE for Frontend-Only Development
// Replaces actual HTTP requests with mock data to unblock frontend development.

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
    getMySessions: async () => {
        await delay(400);
        return mockSessions;
    }
};

