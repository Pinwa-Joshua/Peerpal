import urllib.request
import urllib.error
req = urllib.request.Request('http://localhost:5000/api/tutors/create')
req.method = 'OPTIONS'
req.add_header('Origin', 'http://localhost:5173')
req.add_header('Access-Control-Request-Method', 'POST')
res = urllib.request.urlopen(req)
print(res.headers.__dict__)

