const fs = require('fs');
const file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorFeedbackHub.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/to=\{\\\/dashboard\/sessions\/\\\\\}/g, 'to={/tutor/sessions/25{session.id}}');
content = content.replace(/to=\{\\\/tutor\/sessions\/\\\\\}/g, 'to={/tutor/sessions/25{session.id}}');

fs.writeFileSync(file, content);
