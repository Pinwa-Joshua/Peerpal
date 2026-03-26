const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/admin/AdminFeedback.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/note: \$ action applied from admin feedback dashboard.,/g, 'note: `${action} applied from admin feedback dashboard.`,');
content = content.replace(/className=\{\$ rounded-xl px-4 py-2 text-sm font-semibold transition\}/g, 'className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${action === "warn" ? "bg-amber-100 text-amber-800" : action === "suspend" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"}`}');

fs.writeFileSync(file, content);
