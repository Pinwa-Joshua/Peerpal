const fs = require('fs');

const file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/services/api.js";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/\\\\\\?subject=\\\\/g, '${base}?subject=');
content = content.replace(/\\\\\/sessions\/\?status=\\\\/g, '/sessions/?status=');
content = content.replace(/\\\\\/sessions\\\\\/accept\\\\/g, '/sessions//accept');
content = content.replace(/\\\\\/sessions\\\\\/reject\\\\/g, '/sessions//reject');
content = content.replace(/\\\\\/messages\/thread\/\\\\/g, '/messages/thread/');
content = content.replace(/\\\\\/progress\/quiz\?subject=\\\\/g, '/progress/quiz?subject=');

fs.writeFileSync(file, content);
