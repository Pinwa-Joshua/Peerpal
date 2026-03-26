const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorDashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/ID:\s*5\{session\.tutee_id\}/g, "`ID: ${session.tutee_id}`");
content = content.replace(/to=\{\/dashboard\/sessions\/5\{session\.id\}\}/g, "to={`/dashboard/sessions/${session.id}`}");

fs.writeFileSync(file, content);
