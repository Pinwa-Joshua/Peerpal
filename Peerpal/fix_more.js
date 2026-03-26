const fs = require('fs');
const glob = require('glob');

const files = ["C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/FeedbackHub.jsx", 
"C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorFeedbackHub.jsx",
"C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx",
"C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessions.jsx"];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Use string replacements to avoid regex escaping headaches
    content = content.split('to={\\').join('to={');
    content = content.split('/\\}').join('/}');
    content = content.split('className={\\').join('className={');
    content = content.split('\\}').join('}');
    // Sometimes it's \ \}
    content = content.split('\\ \\}').join('}');

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log("Fixed manually " + file);
    }
});
