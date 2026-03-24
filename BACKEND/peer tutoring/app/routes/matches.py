from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Match, Session, Tutor, User, Notification, Subject
from ..ml.model import final_match_score, encode_subject_safe
from datetime import timedelta
from app.utils.decorators import profile_complete_required

matches_bp = Blueprint("matches", __name__)

# CREATE MATCH
@matches_bp.route("/create", methods=["POST"])
@jwt_required()
def create_match():
    data = request.get_json()
    tutor_id = data.get("tutor_id")
    subject_id = data.get("subject_id")
    if not tutor_id:
        return jsonify({"error": "tutor_id required"}), 400

    tutee_id = get_jwt_identity()
    match = Match(tutor_id=tutor_id, tutee_id=tutee_id, subject_id=subject_id)
    match.end_date = match.start_date + timedelta(days=90)
    db.session.add(match)

    notif = Notification(user_id=tutor_id, message="You have a new match request")
    db.session.add(notif)
    db.session.commit()

    return jsonify({"message": "Match created", "match_id": match.id})

# MY SESSIONS (JOIN MATCH)
@matches_bp.route("/my-sessions", methods=["GET"])
@jwt_required()
def my_sessions():
    user_id = get_jwt_identity()
    sessions = Session.query.join(Match).filter(
        (Match.tutor_id == user_id) | (Match.tutee_id == user_id)
    ).all()
    return jsonify([{
        "id": s.id,
        "tutor_id": s.match.tutor_id,
        "tutee_id": s.match.tutee_id,
        "session_date": s.session_date.isoformat() if s.session_date else None,
        "duration": s.duration
    } for s in sessions])

# RECOMMEND MATCH


@matches_bp.route("/recommend", methods=["POST"])
@jwt_required()
@profile_complete_required
def recommend_match():    
    data = request.get_json()
    user_id = get_jwt_identity()
    learner = User.query.get(user_id)
    subject = data.get("subject")          # for ML
    subject_id = data.get("subject_id")    # for DB
    prefer_same_university = data.get("prefer_same_university", False)
    

    if not learner.learner_style:
        return jsonify({"error": "Please complete your learning style quiz"}), 400

    # Fetch all tutors for the subject
    tutors_query = Tutor.query.join(User).join(User.subjects).filter(Subject.name.ilike(f"%{subject}%"))

    # Optionally filter for same university if student wants
    if prefer_same_university and learner.university_id:
        tutors_query = tutors_query.filter(Tutor.user.has(university_id=learner.university_id))

    tutors = tutors_query.all()

    if not tutors:
        # Fallback: expand to all universities if no tutors found in same university
        tutors = Tutor.query.join(User).join(User.subjects).filter(Subject.name.ilike(f"%{subject}%")).all()
        if not tutors:
            return jsonify({"error": "No tutors found"}), 404

    best_tutor = None
    best_score = 0
    subject_encoded = encode_subject_safe(subject)

    for t in tutors:
        tutor_user = t.user
        if not t.active:
                continue

        # Example ML features
        features = [
            tutor_user.average_rating,
            tutor_user.rating_count,
            1 if t.experience_level else 0,
            Match.query.filter_by(tutor_id=tutor_user.id).count(),
            0,  # placeholder for avg_improvement
            subject_encoded,
            0   # placeholder for other features
        ]

        score = final_match_score(
            features,
            getattr(tutor_user, "tutor_style", None),
            getattr(learner, "learner_style", None)
        )

        # Prefer same university if scores are very close (tie-breaker)
        if best_tutor and abs(score - best_score) < 0.01:
            if learner.university_id and tutor_user.university_id == learner.university_id:
                best_score = score
                best_tutor = tutor_user
        elif score > best_score:
            best_score = score
            best_tutor = tutor_user

    if not best_tutor:
        return jsonify({"error": "No suitable tutor found"}), 404

    # Create the match
    match = Match(tutor_id=best_tutor.id, tutee_id=learner.id, subject_id= subject_id)
    match.end_date = match.start_date + timedelta(days=90)
    db.session.add(match)

    # Notify tutor
    notif = Notification(user_id=best_tutor.id, message="You have a new match request")
    db.session.add(notif)

    db.session.commit()

    return jsonify({
        "message": "Match created",
        "tutor_id": best_tutor.id,
        "match_id": match.id,
        "probability": round(best_score, 2),
        "same_university": best_tutor.university_id == learner.university_id if learner.university_id else False
    })