const fs = require('fs')
const path = 'C:/Users/MVP/Downloads/PeerPal/peerpal/src/context/FeedbackContext.jsx'
let src = fs.readFileSync(path, 'utf8')

// Replace the giant initialState block
const newInitialState = const initialState = {
  tutorDirectory: [],
  courseCatalog: [],
  students: [],
  studentSessions: [],
  tutorSessions: [],
  feedbackRecords: [],
  moderationActions: []
};

src = src.replace(/const initialState = \{[\s\S]*?\n\};\n\nconst FeedbackContext/, newInitialState + '\n\nconst FeedbackContext')

fs.writeFileSync(path, src)
console.log('done modifying initialState')
