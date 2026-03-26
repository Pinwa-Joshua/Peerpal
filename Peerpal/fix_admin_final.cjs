const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/admin/AdminFeedback.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\\ action applied from admin feedback dashboard\.\\/g, '$ action applied from admin feedback dashboard.');

let idx = content.indexOf('className={\\');
if (idx !== -1) {
    let nextIdx = content.indexOf('\\}', idx);
    let str = content.substring(idx, nextIdx + 2);
    if (str.includes('ounded-xl')) {
        content = content.replace(str, 'className={$ rounded-xl px-4 py-2 text-sm font-semibold transition}');
    }
}

fs.writeFileSync(file, content);
