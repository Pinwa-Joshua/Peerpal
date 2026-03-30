import re
with open(r'C:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\tutor\TutorSessionDetail.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

btn = '''</a>
              )}

              {isUpcoming && (
                <button
                  onClick={async () => {
                    try {
                      await MatchesAPI.completeSession(session.id);
                      window.location.reload();
                    } catch (err) {
                      console.error("Failed to complete session", err);
                    }
                  }}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-600/20 transition hover:-translate-y-0.5 hover:bg-green-700"
                >
                  <span className="material-icons-round text-lg">check_circle</span>
                  Mark as Completed
                </button>
              )}'''
text = text.replace('</a>\n                )}', btn)

with open(r'C:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\tutor\TutorSessionDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(text)
