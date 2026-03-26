const fs = require('fs');
const file = "C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/tutor/TutorSessionDetail.jsx";
let content = fs.readFileSync(file, 'utf8');

const returnPos = content.indexOf('  return (', content.indexOf('const isCompleted = session.tab === "completed";'));
if (returnPos > -1) {
    const newReturn = `  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">
            arrow_back
          </span>
          Back
        </button>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex gap-4">
              <div
                className={\`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br \${statusColors[session.status] || "from-gray-400 to-gray-500"} text-xl font-bold text-white shadow-inner\`}
              >
                {session.initials || "S"}
              </div>
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <h1 className="text-2xl font-display font-extrabold text-gray-900">
                    {session.subject}
                  </h1>
                  <span
                    className={\`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold \${st.color}\`}
                  >
                    <span className={\`h-1.5 w-1.5 rounded-full \${st.dotColor}\`}></span>
                    {st.label}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-base">person</span>
                    Student: <span className="font-semibold text-gray-900">{session.tutee_name || \`Student \${session.tutee_id}\`}</span>
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
                  to={\`/tutor/sessions/\${session.id}/feedback\`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-tutor px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-700"
                >
                  Submit Feedback Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
    content = content.substring(0, returnPos) + newReturn;
    fs.writeFileSync(file, content);
} else {
    console.log("Not found");
}
