const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/MySessions.jsx";
let content = fs.readFileSync(file, 'utf8');

// The active tab issue
let idx = content.indexOf('className={\\');
if (idx !== -1) {
    let nextIdx = content.indexOf('\\}', idx);
    let str = content.substring(idx, nextIdx + 2);
    if (str.includes('ounded-full')) {
        content = content.replace(str, 'className={$ rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all}');
    }
}

fs.writeFileSync(file, content);
