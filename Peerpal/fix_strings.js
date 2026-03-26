const fs = require('fs');
const glob = require('glob');

const files = glob.sync('C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/**/*.jsx');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Fix malformed URLs
    if (content.includes('to={\\\/dashboard/sessions/\\\\}')) {
        content = content.replace(/to=\{\\\/dashboard\/sessions\/\\\\}/g, 'to={\/dashboard/sessions/\}');
        changed = true;
    }
    if (content.includes('to={\\\/tutor/dashboard/sessions/\\\\}')) {
        content = content.replace(/to=\{\\\/tutor\/dashboard\/sessions\/\\\\}/g, 'to={\/tutor/dashboard/sessions/\}');
        changed = true;
    }
    if (content.includes('to={\\\/tutor/dashboard/feedback/new/\\\\}')) {
        content = content.replace(/to=\{\\\/tutor\/dashboard\/feedback\/new\/\\\\}/g, 'to={\/tutor/dashboard/feedback/new/\}');
        changed = true;
    }

    // Fix AdminFeedback
    if (content.includes('rounded-full px-3 py-1 text-xs font-semibold \\\\}')) {
        content = content.replace(/className=\{\\rounded-full px-3 py-1 text-xs font-semibold \\\\\}/g, 'className={\ounded-full px-3 py-1 text-xs font-semibold \}');
        changed = true;
    }
    if (content.includes('note: \\\\')) {
        content = content.replace(/note: \\\\.*?\\,/g, 'note: \${action} action applied from admin feedback dashboard.\,');
        changed = true;
    }
    if (content.includes('ounded-xl px-4 py-2 text-sm font-semibold transition \\\\}')) {
        content = content.replace(/className=\{\\rounded-xl px-4 py-2 text-sm font-semibold transition \\\\\}/g, 'className={\ounded-xl px-4 py-2 text-sm font-semibold transition \}');
        changed = true;
    }

    // Fix MySessions & TutorSessions
    if (content.includes('ounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all \\\\}')) {
        content = content.replace(/className=\{\\rounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all \\\\\}/g, 'className={\ounded-full border-2 px-5 py-2 text-sm font-semibold capitalize transition-all \}');
        changed = true;
    }
    // Need to consider TutorSessions color might be 'border-tutor bg-tutor'
    if (file.includes('TutorSessions.jsx') && changed) {
        content = content.replace(/border-primary bg-primary/g, 'border-tutor bg-tutor');
        content = content.replace(/shadow-primary/g, 'shadow-teal-700');
    }
    
    if (content.includes('px-2 py-0.5 rounded-full text-xs font-semibold capitalize \\\\}')) {
        content = content.replace(/className=\{\\px-2 py-0.5 rounded-full text-xs font-semibold capitalize \\\\\}/g, 'className={\px-2 py-0.5 rounded-full text-xs font-semibold capitalize \}');
        changed = true;
    }

    // Fix TutorSessionDetail.jsx
    if (content.includes('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold \\ \\\\}')) {
        content = content.replace(/className=\{\\inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold \\ \\\\\}/g, 'className={\inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold  \}');
        changed = true;
    }
    if (content.includes('className={\\h-1.5 w-1.5 rounded-full \\\\}')) {
        content = content.replace(/className=\{\\h-1\.5 w-1\.5 rounded-full \\\\\}/g, 'className={\h-1.5 w-1.5 rounded-full \}');
        changed = true;
    }

    // Fix TutorDashboardHome
    if (content.includes('student: session.tutee_name || \\ID: \\\\}')) {
        content = content.replace(/student: session\.tutee_name \|\| \\ID: \\\\}/g, 'student: session.tutee_name || \ID: \}');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log("Fixed " + file);
    }
});
