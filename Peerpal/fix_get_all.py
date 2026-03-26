import re
with open('C:/Users/MVP/Downloads/PeerPal/peerpal/src/services/api.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r"getAll:\s*async\s*\(subject = ''\)\s*=>\s*\{.*?\}", 
    "getAll: async (subject = '') => { return await apiCall(subject ? /api/tutors/?subject=\ : '/api/tutors/'); }", 
    text, flags=re.DOTALL)

with open('C:/Users/MVP/Downloads/PeerPal/peerpal/src/services/api.js', 'w', encoding='utf-8') as f:
    f.write(text)
