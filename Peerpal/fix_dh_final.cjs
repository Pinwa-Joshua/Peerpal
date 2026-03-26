const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/DashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

let badStr = "w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner}";
let idx = content.indexOf(badStr);
if (idx !== -1) {
    let startIdx = content.lastIndexOf('className=', idx);
    let str = content.substring(startIdx, idx + badStr.length);
    content = content.replace(str, 'className={g-gradient-to-br 22{session.gradient} w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white font-bold shadow-inner}');
}

fs.writeFileSync(file, content);
