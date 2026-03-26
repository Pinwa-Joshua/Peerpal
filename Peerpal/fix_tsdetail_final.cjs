const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

let startIndex = content.indexOf('className={');
let endIndex = content.indexOf('shadow-inner}');

if (startIndex !== -1 && endIndex !== -1 && content.substring(startIndex, endIndex).includes('h-16 w-16')) {
    content = content.substring(0, startIndex) + 'className={lex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br 20{statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner}' + content.substring(endIndex + 14);
}

fs.writeFileSync(file, content);
