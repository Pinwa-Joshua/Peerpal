const fs = require('fs');

let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

// The tricky \f issue
content = content.replace(/className=\{\\?[\x0c\f]lex h-16 w-16[^]*?\\\}/g, 'className={lex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br 22{statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner}');
content = content.replace(/className=\{\\inline-flex[^]*?\\\\\}/g, 'className={inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold 22{st.color}}');
content = content.replace(/className=\{\\h-1.5[^]*?\\\\\}/g, 'className={h-1.5 w-1.5 rounded-full 22{st.dotColor}}');


fs.writeFileSync(file, content);

