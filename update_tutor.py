import sys
import os

path = r'c:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\dashboard\BrowseTutors.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

old_str = '''const data = await TutorAPI.getTutors();
        setTutors(Array.isArray(data) ? data : []);'''

new_str = '''const data = await TutorAPI.getTutors();
        const formattedData = (Array.isArray(data) ? data : []).map(t => ({
          ...t,
          subjects: typeof t.subjects === 'string' ? t.subjects.split(',').map(s => s.strip()) : (t.subjects || [])
        }));
        setTutors(formattedData);'''

if old_str in content:
    content = content.replace(old_str, new_str.replace('.strip()', '.trim()'))
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated BrowseTutors.jsx')
else:
    print('String not found in BrowseTutors.jsx')
