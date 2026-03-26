const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorDashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{w-8/g, 'className="w-8');
content = content.replace(/shadow-inner text-xs\}/g, 'shadow-inner text-xs"');

fs.writeFileSync(file, content);
