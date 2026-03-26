const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/MySessions.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{\w-12/g, 'className="w-12');
content = content.replace(/className=\{\\w-12 h-12 rounded-full bg-gradient-to-br \\ flex items-center justify-center text-white font-bold flex-shrink-0\\\}/g, 'className={`w-12 h-12 rounded-full bg-gradient-to-br ${session.gradient || "from-blue-500 to-indigo-600"} flex items-center justify-center text-white font-bold flex-shrink-0`}');

fs.writeFileSync(file, content);
