const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/admin/AdminFeedback.jsx";
let content = fs.readFileSync(file, 'utf8');

// Fix note:
content = content.replace(/note: \\\$\s*action applied from admin feedback dashboard\.\r?\n?,/, 'note: $ action applied from admin feedback dashboard.,');

// Fix className:
content = content.replace(/className=\{\$\s*rounded-xl px-4 py-2 text-sm font-semibold transition\}/, 'className={$ rounded-xl px-4 py-2 text-sm font-semibold transition}');

fs.writeFileSync(file, content);
