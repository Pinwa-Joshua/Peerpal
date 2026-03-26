const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorDashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{w-12/g, 'className="w-12');
content = content.replace(/shadow-inner\}/g, 'shadow-inner"');

fs.writeFileSync(file, content);
