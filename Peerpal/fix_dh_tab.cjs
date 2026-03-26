const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/dashboard/DashboardHome.jsx";
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className=\{\\\t?ext-xs font-semibold px-2\.5 py-1 rounded-full capitalize \\\}/g, 'className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize $${session.format === "online" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}');

// what about the \w-14 bug I missed previously?
content = content.replace(/className=\{\\w-14.*?\\\}/gs, 'className={`w-14 h-14 rounded-full bg-gradient-to-br ${tutor.gradient || "from-gray-400 to-gray-500"} flex flex-shrink-0 items-center justify-center text-white text-lg font-bold`}');


fs.writeFileSync(file, content);
