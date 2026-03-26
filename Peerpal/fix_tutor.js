const fs = require('fs');
const file = 'src/pages/tutor/TutorDashboardHome.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const STATS = \\[[\\s\\S]*?\\];/g, '// STATS removed');
content = content.replace(/const UPCOMING_SESSIONS = \\[[\\s\\S]*?\\];/g, '// UPCOMING_SESSIONS removed');
fs.writeFileSync(file, content);
console.log('Done');
