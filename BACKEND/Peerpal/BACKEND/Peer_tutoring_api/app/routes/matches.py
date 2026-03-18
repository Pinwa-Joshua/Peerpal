from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Match, Session,Tutor
from app.ml.model import predict_probability,le, encode_subject_safe

matches_bp = Blueprint("matches", __name__)


@matches_bp.route("/create", methods=["POST"])
@jwt_required()
def create_match():
    data = request.get_json()
    tutor_id = data["tutor_id"]
    tutee_id = get_jwt_identity()
    match = Match(tutor_id=tutor_id, tutee_id=tutee_id)
    db.session.add(match)
    db.session.commit()
    return jsonify({"message": "Match created", "match_id": match.id})

@matches_bp.route("/my-sessions", methods=["GET"])
@jwt_required()
def my_sessions():
    user_id = get_jwt_identity()
    sessions = Session.query.join(Match).filter(
        (Match.tutor_id==user_id) | (Match.tutee_id==user_id)
    ).all()
    return jsonify([{
        "id": s.id,
        "tutor_id": s.match.tutor_id,
        "tutee_id": s.match.tutee_id,
        "session_date": s.session_date,
        "duration": s.duration
    } for s in sessions])


@matches_bp.route("/recommend", methods=["POST"])
@jwt_required()
def recommend_match():

    data = request.get_json()
    user_id = get_jwt_identity()

    subject = data.get("subject")

    # Find tutors for subject
    tutors = Tutor.query.filter(
        Tutor.subjects.ilike(f"%{subject}%")
    ).all()

    if not tutors:
        return jsonify({"error": "No tutors found"}), 404

    best_tutor = None
    best_score = 0
    subject_encoded = encode_subject_safe(subject)

    # Build features and score each tutor
    for t in tutors:
        user = t.user

        features = [
            user.average_rating,
            user.rating_count,
            1 if t.experience_level else 0,
            Match.query.filter_by(tutor_id=user.id).count(),
            0 , #  this is a placeholder for avg_improvement (you can calculate this)
            subject_encoded,
            0
        ]

        score = predict_probability(features)

        if score > best_score:
            best_score = score
            best_tutor = user

    if not best_tutor:
        return jsonify({"error": "No suitable match"}), 404

    # Create match record
    match = Match(
        tutor_id=best_tutor.id,
        tutee_id=user_id
    )

    db.session.add(match)
    db.session.commit()

    return jsonify({
        "message": "Match created",
        "tutor_id": best_tutor.id,
        "match_id": match.id,
        "probability": best_score
    })
