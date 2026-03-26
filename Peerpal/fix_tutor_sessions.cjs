const fs = require('fs');
const file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessions.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{\\\r?\n?(.)ounded-full[\s\S]*?\\\\\}/m, 'className={$ rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all}');
content = content.replace(/to=\{\\\/dashboard\/sessions\/\\\\\}/g, 'to={/tutor/sessions/25{session.id}}');

fs.writeFileSync(file, content);
