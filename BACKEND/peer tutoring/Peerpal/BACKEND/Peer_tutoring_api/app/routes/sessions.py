from flask import jsonify, Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Session, Match



sessions_bp =Blueprint("sessions", __name__)

# request
@sessions_bp.route("/request", methods=["POST"])
@jwt_required()
def request_session():

    data = request.get_json()
    user_id = get_jwt_identity()

    match = Match.query.get(data["match_id"])

    if not match:
        return jsonify({"error": "Match not found"}), 404

    session = Session(
        match_id=match.id,
        tutor_id=match.tutor_id,
        tutee_id=match.tutee_id,
        session_date=data.get("session_date"),
        duration=data.get("duration")
    )

    db.session.add(session)
    db.session.commit()

    return jsonify({"message": "Session requested"}), 201

#accept
@sessions_bp.route("/<int:session_id>/accept", methods=["POST"])
@jwt_required()
def accept_session(session_id):

    user_id = get_jwt_identity()

    session = Session.query.get_or_404(session_id)

    if session.tutor_id != int(user_id):
        return jsonify({"error": "Only tutor can accept"}), 403

    session.status = "accepted"

    db.session.commit()

    return jsonify({"message": "Session accepted"})

# REJECT 
@sessions_bp.route("/<int:session_id>/reject", methods=["POST"])
@jwt_required()
def reject_session(session_id):

    user_id = get_jwt_identity()

    session = Session.query.get_or_404(session_id)

    if session.tutor_id != user_id:
        return jsonify({"error": "Only tutor can reject"}), 403

    session.status = "rejected"

    db.session.commit()

    return jsonify({"message": "Session rejected"})

#complete
@sessions_bp.route("/<int:session_id>/complete", methods=["POST"])
@jwt_required()
def complete_session(session_id):

    session = Session.query.get_or_404(session_id)

    session.status = "completed"

    db.session.commit()

    return jsonify({"message": "Session completed"})

#get sessions
@sessions_bp.route("/my", methods=["GET"])
@jwt_required()
def my_sessions():

    user_id = get_jwt_identity()

    sessions = Session.query.filter(
        (Session.tutor_id == user_id) |
        (Session.tutee_id == user_id)
    ).all()

    return jsonify([
        {
            "id": s.id,
            "match_id": s.match_id,
            "status": s.status,
            "date": s.session_date,
            "duration": s.duration
        }
        for s in sessions
    ])

# tutor view requests
@sessions_bp.route("/requests", methods=["GET"])
@jwt_required()
def tutor_requests():

    user_id = get_jwt_identity()

    sessions = Session.query.filter_by(
        tutor_id=user_id,
        status="pending"
    ).all()

    return jsonify([
        {
            "session_id": s.id,
            "tutee_id": s.tutee_id,
            "date": s.session_date,
            "duration": s.duration
        }
        for s in sessions
    ])

    
    
