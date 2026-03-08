from flask import Blueprint, request, jsonify
from app.ml.model import predict_probability, le, encode_subject_safe

ml_bp = Blueprint("ml", __name__)

@ml_bp.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Encode subject safely
    subject = data("subject")
    subject_encoded = encode_subject_safe(subject)
    
    # Construct feature array
    features = [
        data["tutor_rating"],
        data["rating_count"],
        data["experience_level"],
        data["sessions"],
        data["avg_improvement"],
        subject_encoded,
        data["success_prob"]
    ]

    # Predict probability
    prob = predict_probability(features)

    return jsonify({
        "success_probability": float(prob)
    })