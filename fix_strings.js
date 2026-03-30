@
const fs = require("fs");
const path = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/SessionDetail.jsx";
let t = fs.readFileSync(path, "utf8");
t = t.replace("comments: Knowledge: , Comm:", "comments: `Knowledge: ${ratings.knowledge || 0}, Comm: ${ratings.communication || 0}`");
fs.writeFileSync(path, t);
@
