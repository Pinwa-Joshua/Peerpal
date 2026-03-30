import re

path = r'C:\Users\MVP\Downloads\PeerPal\Peerpal\src\pages\TutorOnboarding.jsx'
with open(path, 'r') as f:
    text = f.read()

text = text.replace(
'''      /* step 5 */
      format: "",''',
'''      /* step 5 */
      format: "",
      hourlyRate: 100,''')

text = text.replace(
'''        await TutorAPI.createProfile({
          subjects: data.subjects,
          experience_level: data.experience,
        });''',
'''        await TutorAPI.createProfile({
          subjects: data.subjects,
          experience_level: data.experience,
          hourly_rate: data.hourlyRate,
        });''')

with open(path, 'w') as f:
    f.write(text)
