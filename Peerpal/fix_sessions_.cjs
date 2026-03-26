const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessions.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{\$\s*rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all\}/g, 'className={`$${activeTab === tab ? "border-primary bg-primary text-white" : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"} rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all`}');

fs.writeFileSync(file, content);

// What about MySessions.jsx? Let's fix that one too since it was in the same batch with @"
file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/MySessions.jsx";
content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{\$\s*rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all\}/g, 'className={`$${activeTab === tab ? "border-primary bg-primary text-white" : "border-gray-100 bg-white text-gray-600 hover:border-gray-200"} rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all`}');

fs.writeFileSync(file, content);

