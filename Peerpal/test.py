import os
import json

file_path = r'C:\Users\MVP\Downloads\PeerPal\peerpal\src\pages\dashboard\DashboardHome.jsx'
with open('temp.txt', 'r', encoding='utf-8') as f:
    content = f.read()

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Done')
