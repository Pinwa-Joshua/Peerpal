const fs = require('fs');
const path = 'C:/Users/MVP/Downloads/PeerPal/peerpal/src/services/api.js';
let content = fs.readFileSync(path, 'utf8');

// replace mockUser, mockTutors, mockSessions
content = content.replace(/const mockUser = \{[\s\S]*?\};\n\n/, '');
content = content.replace(/const mockTutors = \[[\s\S]*?\];\n\n/, '');
content = content.replace(/const mockSessions = \[[\s\S]*?\];\n\n/, '');

// Fix getMySessions
content = content.replace(/getMySessions: async \(\) => \{\s*await delay\(\d+\);\s*return mockSessions;\s*\}/, "getMySessions: async () => {\n        return await apiCall('/api/sessions/');\n    }");

// Fix getAll in TutorAPI
content = content.replace(/getAll: async \(subject = ''\) => \{[\s\S]*?return mockTutors;\s*\}/, "getAll: async (subject = '') => {\n        const base = '/api/tutors/';\n        return await apiCall(subject ? \\?subject=\\ : base);\n    }");

// Fix MatchesAPI.createSession fallback
content = content.replace(/createSession: async \(tutor_id\) => \{[\s\S]*?return \{ message: "Session requested", session: newSession \};\s*\}/, "createSession: async (tutor_id) => {\n        return await apiCall('/api/sessions/create', { method: 'POST', body: JSON.stringify({ tutor_id }) });\n    }");

// Fix MatchesAPI.recommendTutor
content = content.replace(/recommendTutor: async \(\{[\s\S]*?return \{ message: "Match successful!", tutor: matchedTutor \};\s*\}/, "recommendTutor: async (data = {}) => {\n        return await apiCall('/api/matches/recommend', { method: 'POST', body: JSON.stringify(data) });\n    }");

fs.writeFileSync(path, content, 'utf8');
console.log('Done cleaning API');
