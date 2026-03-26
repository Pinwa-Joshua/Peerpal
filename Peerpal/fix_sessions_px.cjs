const fs = require('fs');

const classReplace = (content) => {
    let newClass = 'className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${session.status === "cancelled" ? "bg-red-50 text-red-700" : session.status === "completed" ? "bg-blue-50 text-blue-700" : session.status === "upcoming" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}';
    return content.replace(/className=\{\\?px-2 py-0\.5 rounded-full text-xs font-semibold capitalize \s*\\\\?\}/g, newClass);
};

let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/MySessions.jsx";
let content = fs.readFileSync(file, 'utf8');
content = classReplace(content);
fs.writeFileSync(file, content);

file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessions.jsx";
content = fs.readFileSync(file, 'utf8');
content = classReplace(content);
fs.writeFileSync(file, content);
