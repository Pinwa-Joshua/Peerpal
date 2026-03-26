const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/DashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{w-14 h-14 rounded-full bg-gradient-to-br \d+\{tutor\.gradient[^}]*\}\s*flex flex-shrink-0 items-center justify-center text-white text-lg font-bold\}/g, 'className={`w-14 h-14 rounded-full bg-gradient-to-br ${tutor.gradient || "from-gray-400 to-gray-500"} flex flex-shrink-0 items-center justify-center text-white text-lg font-bold`}');

fs.writeFileSync(file, content);
