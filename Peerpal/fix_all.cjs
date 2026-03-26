const fs = require('fs');
const glob = require('glob');

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // We noticed that expressions like className={\flex ...\} got messed up
    // Let's just fix the specific broken things in TutorSessionDetail.jsx
    
    // We can replace className={\...\} specifically for TutorSessionDetail.jsx
    if (file.includes('TutorSessionDetail.jsx')) {
        content = content.replace(/className=\{\\\n?\s*flex/g, 'className={lex');
        content = content.replace(/bg-gradient-to-br \\ text-xl/g, 'bg-gradient-to-br  text-xl');
        content = content.replace(/shadow-inner\\\}/g, 'shadow-inner}');
        
        content = content.replace(/className=\{\\inline-flex([^]*?)\\ \\\\\}/g, 'className={inline-flex }');
        content = content.replace(/className=\{\\h-1\.5 w-1\.5 rounded-full \\\\\}/g, 'className={h-1.5 w-1.5 rounded-full }');
    }
    
    // Also let's generally fix all className={\... \} across the board just in case
    // We will use cautious regex
    content = content.replace(/className=\{\\([\w\s-]+)\\\}/g, 'className={$1}');
    
    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log("Fixed " + file);
    }
}

glob.sync("C:/Users/MVP/Downloads/PeerPal/Peerpal/src/pages/**/*.jsx").forEach(fixFile);

