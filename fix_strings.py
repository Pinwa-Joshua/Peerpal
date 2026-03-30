import re
with open(r'c:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\dashboard\SessionDetail.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('comments: Knowledge: , Comm:', 'comments: \Knowledge: \, Comm: \\')

with open(r'c:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\dashboard\SessionDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
