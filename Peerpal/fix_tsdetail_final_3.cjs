const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

let startIndex = content.indexOf('className={');

while (startIndex !== -1) {
    let checkStr = content.substring(startIndex, startIndex + 300);
    if (checkStr.includes('h-16 w-16') && checkStr.includes('shadow-inner}')) {
        let endIndex = content.indexOf('shadow-inner}', startIndex);
        let replaceStr = content.substring(startIndex, endIndex + 13);
        content = content.replace(replaceStr, 'className={lex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br 10{statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner}');
        break;
    }
    startIndex = content.indexOf('className={', startIndex + 1);
}

fs.writeFileSync(file, content);
