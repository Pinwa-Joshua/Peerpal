const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

let fixedClass = 'className={lex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br 20{statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner}';

content = content.replace(/className=\{.*?h-16\s*w-16.*?shadow-inner\}/g, fixedClass);

fs.writeFileSync(file, content);
