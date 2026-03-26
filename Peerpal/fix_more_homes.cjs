const fs = require('fs');

// Fix DashboardHome
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/DashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{\$\s*w-11\s*h-11\}/g, 'className={g-gradient-to-br 5{session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner}');
content = content.replace(/className=\{\\w-14\s*h-14([^]*?)\\\}/g, 'className={w-14 h-14 rounded-full bg-gradient-to-br 5{tutor.gradient || "from-gray-400 to-gray-500"} flex flex-shrink-0 items-center justify-center text-white text-lg font-bold}');

fs.writeFileSync(file, content);

// Fix TutorDashboardHome
file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorDashboardHome.jsx";
content = fs.readFileSync(file, 'utf8');

content = content.replace(/\\ID:\s*\\\\/g, 'ID: 5{session.tutee_id}');
content = content.replace(/to=\{\\\/tutor\/dashboard\/sessions\/\\\\\}/g, 'to={/dashboard/sessions/5{session.id}}');
content = content.replace(/to=\{\\\/tutor\/sessions\/\\\\\}/g, 'to={/tutor/sessions/5{session.id}}');

fs.writeFileSync(file, content);

