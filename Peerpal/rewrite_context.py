import os
import re

file_path = r'C:\Users\MVP\Downloads\PeerPal\peerpal\src\context\FeedbackContext.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    text = f.read()

def empty_array(var_name, text):
    pattern = r'const ' + var_name + r'\s*=\s*\['
    match = re.search(pattern, text)
    if not match: return text
    
    start_idx = match.end() - 1
    depth = 0
    end_idx = -1
    for i in range(start_idx, len(text)):
        if text[i] == '[': depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                end_idx = i
                break
    
    if end_idx != -1:
        if text[end_idx+1:end_idx+2] == ';':
            offset = end_idx + 2
        else:
            offset = end_idx + 1
        return text[:match.start()] + f'const {var_name} = [];\n// Mock data cleared\n' + text[offset:]
    return text

vars_to_clear = ['courseCatalog', 'tutorDirectory', 'students', 'tutorSessions', 'studentSessions', 'initialFeedbackRecords', 'flaggedCases']

for v in vars_to_clear:
    text = empty_array(v, text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(text)

print("Done")
