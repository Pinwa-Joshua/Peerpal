const fs = require('fs');
const file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/DashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

// Replace standard stats mappings
content = content.replace(/className=\{\\w-11 h-11([^]*?)\\\}/g, 'className={$ w-11 h-11}');

// Any other class mangles?
// content = content.replace(/className=\{\\([\w\s-]+)\\\}/g, 'className={$1}');

fs.writeFileSync(file, content);
