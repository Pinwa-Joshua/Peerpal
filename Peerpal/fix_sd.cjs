const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/SessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{\\?[\x0c\f]lex[^\}]*?\\\}/g, 'className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${session.gradient} font-bold text-xl`}');
content = content.replace(/className=\{\\\n?\s*w-12[^\}]*?\\\}/g, 'className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${session.gradient} font-bold text-xl`}');
content = content.replace(/className=\{\\\n?\s*inline-flex[^\}]*?\\\}/g, 'className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${st.bg} ${st.text}`}');
content = content.replace(/className=\{\\\n?\s*h-1.5[^\}]*?\\\}/g, 'className={`h-1.5 w-1.5 rounded-full ${st.dot}`}');

fs.writeFileSync(file, content);
