const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/DashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

// The backspace character \x08!
content = content.replace(/className=\{\x08bg-gradient-to-br.*?shadow-inner\}/gs, 'className={`bg-gradient-to-br ${session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner`}');
content = content.replace(/className=\x08bg-gradient-to-br.*?\n.*?shadow-inner\}/g, 'className={`bg-gradient-to-br ${session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner`}');
content = content.replace(/className=\{\\\x08bg.*?shadow-inner\}/gs, 'className={`bg-gradient-to-br ${session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner`}');

let lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('session.gradient')) {
        let regex = /className=.*shadow-inner\}/;
        if (regex.test(lines[i])) {
            lines[i] = lines[i].replace(regex, 'className={`bg-gradient-to-br ${session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner`}');
        } else if (regex.test(lines[i] + ' ' + lines[i+1])) {
             lines[i] = lines[i].replace(/className=.*/, 'className={`bg-gradient-to-br ${session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner`}');
             lines[i+1] = lines[i+1].replace(/.*shadow-inner\}/, '');
        }
    }
}
content = lines.join('\n');
fs.writeFileSync(file, content);

