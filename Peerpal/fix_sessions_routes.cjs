const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/MySessions.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/to=\{\/dashboard\/sessions\/\d+\{session\.id\}\}/g, 'to={`/dashboard/sessions/${session.id}`}');

fs.writeFileSync(file, content);

// Also maybe TutorSessions has it?
file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessions.jsx";
content = fs.readFileSync(file, 'utf8');
content = content.replace(/to=\{\/tutor\/sessions\/\d+\{session\.id\}\}/g, 'to={`/tutor/sessions/${session.id}`}');
content = content.replace(/to=\{\/dashboard\/sessions\/\d+\{session\.id\}\}/g, 'to={`/tutor/sessions/${session.id}`}');
fs.writeFileSync(file, content);

