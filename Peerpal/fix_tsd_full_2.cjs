const fs = require('fs');
let file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

let replacement = `              <div
                className={\`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br $${'{'}statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner\`}
              >
                {session.initials || "S"}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-2xl font-display font-extrabold text-gray-900">
                    {session.subject}
                  </h1>
                  <span
                    className={\`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold $${'{'}st.color}\`}
                  >
                    <span className={\`h-1.5 w-1.5 rounded-full $${'{'}st.dotColor}\`}></span>
                    {st.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-base">person</span>
                    Student: <span className="font-semibold text-gray-900">{session.tutee_name || \`Student $${'{'}session.tutee_id}\`}</span> 
                  </div>
                  <span className="hidden sm:block">&bull;</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-base">videocam</span>
                    {session.session_type || "Online"}
                  </div>
                </div>
              </div>
            </div>

            {session.status === "completed" && !session.feedback_submitted && (
              <div className="mt-4 sm:mt-0">
                <Link
                  to={\`/tutor/sessions/$${'{'}session.id}/feedback\`}
`;

content = content.replace(/<div\s+className={`flex h-16 w-16[^]*?className="inline-flex items-center justify-center gap-2 rounded-xl bg-tutor/, replacement + '                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-tutor');

fs.writeFileSync(file, content);

