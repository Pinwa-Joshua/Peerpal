const fs = require('fs');

const file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/FeedbackHub.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.split('to={\\/dashboard/sessions/\\\\}').join('to={/dashboard/sessions/}');

fs.writeFileSync(file, content);
