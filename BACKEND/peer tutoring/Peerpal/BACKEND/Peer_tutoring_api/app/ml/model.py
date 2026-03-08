import joblib

# Load once at the top
model = joblib.load('tutoring_model.pkl')
le = joblib.load('subject_encoder.pkl')  # LabelEncoder for subject

def encode_subject_safe(subject):
    #Encode subject; return -1 if unseen.
    try:
        return le.transform([subject])[0]
    except ValueError:
        return -1

def predict_match(features):
    #Predict class. Assumes features already include encoded subject.
    return model.predict([features])[0]

def predict_probability(features):
    #Predict success probability. Assumes features already include encoded subject.
    probs = model.predict_proba([features])
    return probs[0][1]