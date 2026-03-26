import re

path = 'C:/Users/MVP/Downloads/PeerPal/peerpal/src/services/api.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Try to remove completely mock items.
content = re.sub(r'const mockUser = \{.*?\};', '', content, flags=re.DOTALL)
content = re.sub(r'const mockTutors = \[.*?\];', '', content, flags=re.DOTALL)
content = re.sub(r'const mockSessions = \[.*?\];', '', content, flags=re.DOTALL)

# Fix getMySessions
content = re.sub(r'getMySessions:\s*async\s*\(\)\s*=>\s*\{.*?return mockSessions;\s*\},', "getMySessions: async () => { return await apiCall('/api/sessions/'); },", content, flags=re.DOTALL)

# Fix getAll
content = re.sub(r"getAll:\s*async\s*\(subject\s*=\s*''\)\s*=>\s*\{.*?return mockTutors;\s*\},", "getAll: async (subject = '') => { return await apiCall(subject ? /api/tutors/?subject=\ : '/api/tutors/'); },", content, flags=re.DOTALL)

# Fix getSessions fallback (if any)
content = re.sub(r'return status \? mockSessions.*?mockSessions;', 'return [];', content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("done API cleanup")
