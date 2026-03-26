const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/DashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

// just blindly replace the entire block
let start = content.indexOf('className=g-gradient-to-br');
if(start !== -1) {
    let end = content.indexOf('shadow-inner}', start) + 'shadow-inner}'.length;
    let oldStr = content.substring(start, end);
    let newStr = 'className={`bg-gradient-to-br ${session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner`}';
    content = content.replace(oldStr, newStr);
}

fs.writeFileSync(file, content);
