const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('className={') && lines[i].includes('lex h-16 w-16')) {
        let j = i;
        while (!lines[j].includes('shadow-inner}')) {
            lines[j] = '';
            j++;
        }
        lines[j] = '                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner`}'
    }
}
content = lines.join('\n');
fs.writeFileSync(file, content);
