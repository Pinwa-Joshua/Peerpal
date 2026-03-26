import sys, re

path = r'C:\Users\MVP\Downloads\PeerPal\peerpal\src\context\FeedbackContext.jsx'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

new_state = '''const initialState = {
  tutorDirectory: [],
  courseCatalog: [],
  students: [],
  studentSessions: [],
  tutorSessions: [],
  feedbackRecords: [],
  moderationActions: []
};'''

# Regex to match const initialState = { ...anything... };
text = re.sub(r'const initialState = \{.*?\};', new_state, text, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

print('Modified successfully. Lines remaining:')
