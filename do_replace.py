
import sys

filepath = r"C:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\dashboard\SessionDetail.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    t = f.read()

import re
t = re.sub(r"comments: Knowledge: , Comm: \\?", "comments: `Knowledge: ${ratings.knowledge || 0}, Comm: ${ratings.communication || 0}`", t)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(t)

