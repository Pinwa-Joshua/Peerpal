from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..database import db
from ..models import Progress, Session, Match
from datetime import datetime

progress_bp = Blueprint("progress", __name__)


# add progress after session

@progress_bp.route("/add", methods=["POST"])
@jwt_required()
def add_progress():
    data = request.get_json()

    if not data.get("session_id") or not data.get("topic"):
        return jsonify({"error": "session_id and topic required"}), 400

    if data.get("pre_score") is None or data.get("post_score") is None:
        return jsonify({"error": "pre_score and post_score required"}), 400

    if data["pre_score"] < 1 or data["pre_score"] > 5:
        return jsonify({"error": "pre_score must be 1-5"}), 400

    if data["post_score"] < 1 or data["post_score"] > 5:
        return jsonify({"error": "post_score must be 1-5"}), 400


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
        study_hours = data.get("study_hours"),
        notes = data.get("notes")
        

    )

    progress.calculate_improvement()

    db.session.add(progress)
    db.session.commit()

    return jsonify({
        "message": "Progress recorded",
        "improvement": progress.improvement
    }), 201


# get progress for a match
@progress_bp.route("/match/<int:match_id>", methods=["GET"])
@jwt_required()
def get_match_progress(match_id):
    entries = Progress.query.filter_by(match_id=match_id).all()

    return jsonify([
        {
            "topic": p.topic,
            "pre_score": p.pre_score,
            "post_score": p.post_score,
            "improvement": p.improvement,
            "date": p.created_at
        }
        for p in entries
    ])

# get overall progress summary
@progress_bp.route("/summary/<int:match_id>", methods=["GET"])
@jwt_required()
def progress_summary(match_id):
    entries = Progress.query.filter_by(match_id=match_id).all()

    if not entries:
        return jsonify({"message": "No progress data"}), 404

    total_improvement = sum(p.improvement for p in entries)
    avg_improvement = total_improvement / len(entries)

    return jsonify({
        "sessions_tracked": len(entries),
        "total_improvement": total_improvement,
        "average_improvement": round(avg_improvement, 2)
    })