from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Progress, Session, Notification
from app.utils.decorators import profile_complete_required

progress_bp = Blueprint("progress", __name__)

# ADD PROGRESS
@progress_bp.route("/add", methods=["POST"])
@jwt_required()
@profile_complete_required
def add_progress():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    # validate inputs
    for key in ["session_id", "topic", "pre_score", "post_score"]:
        if data.get(key) is None:
            return jsonify({"error": f"{key} required"}), 400

    if not 1 <= data["pre_score"] <= 5 or not 1 <= data["post_score"] <= 5:
        return jsonify({"error": "Scores must be 1-5"}), 400

    if data["post_score"] < data["pre_score"]:
        return jsonify({"error": "post_score cannot be less than pre_score"}), 400

    session = Session.query.get(data["session_id"])
    if not session:
        return jsonify({"error": "Session not found"}), 404

    if session.status != "completed":
        return jsonify({"error": "Progress can only be added after session completion"}), 400

    progress = Progress(
        match_id=session.match_id,
        session_id=session.id,
        topic=data["topic"],
        pre_score=data["pre_score"],
        post_score=data["post_score"],
        study_hours=data.get("study_hours"),
        notes=data.get("notes")
    )
    progress.calculate_improvement()

    db.session.add(progress)
    db.session.commit()

    # Optional notification to tutee
    notif = Notification(user_id=session.tutee_id, message=f"Progress added for session {session.id}")
    db.session.add(notif)
    db.session.commit()

    return jsonify({
        "message": "Progress recorded",
        "improvement": progress.improvement,
        "date": progress.created_at.isoformat()
    }), 201

# GET MATCH PROGRESS
@progress_bp.route("/match/<int:match_id>", methods=["GET"])
@jwt_required()
def get_match_progress(match_id):
    entries = Progress.query.filter_by(match_id=match_id).order_by(Progress.created_at).all()
    return jsonify([{
        "topic": p.topic,
        "pre_score": p.pre_score,
        "post_score": p.post_score,
        "improvement": p.improvement,
        "date": p.created_at.isoformat()
    } for p in entries])

# PROGRESS SUMMARY
@progress_bp.route("/summary/<int:match_id>", methods=["GET"])
@jwt_required()
def progress_summary(match_id):
    entries = Progress.query.filter_by(match_id=match_id).all()
    if not entries:
        return jsonify({"message": "No progress data"}), 404

    total_improvement = round(sum(p.improvement for p in entries), 2)
    avg_improvement = round(total_improvement / len(entries), 2)
    max_improvement = max(p.improvement for p in entries)
    min_improvement = min(p.improvement for p in entries)

    return jsonify({
        "sessions_tracked": len(entries),
        "total_improvement": total_improvement,
        "average_improvement": avg_improvement,
        "max_improvement": max_improvement,
        "min_improvement": min_improvement
    })