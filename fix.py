with open(r'c:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\dashboard\SessionDetail.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

import re
c2 = re.sub(r'const handleSubmit = \(\) => \{.*?\n    \};', '''const handleSubmit = async () => {
    const values = Object.values(ratings).filter((value) => value > 0);
    if (!values.length) {
      setStatus({ type: "error", message: "Please rate at least one category." });
      return;
    }

    const overallRating = Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
    
    try {
      await FeedbackAPI.submitFeedback({
        session_id: session.id || id,
        rating: overallRating,
        comments: \Knowledge: \, Comm: \, Helpfulness: \\
      });

      setSubmittedFeedback({
        ratings,
        overallRating,
        submittedAt: new Date().toISOString(),
      });
      setStatus({ type: "success", message: "Tutor rating submitted for this session." });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to submit feedback." });
    }
  };''', content, flags=re.DOTALL)

with open(r'c:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\dashboard\SessionDetail.jsx', 'w', encoding='utf-8') as f:
    f.write(c2)
