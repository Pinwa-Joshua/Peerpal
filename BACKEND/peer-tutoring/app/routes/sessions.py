from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Session, Match, Notification
from app.utils.decorators import profile_complete_required

sessions_bp = Blueprint("sessions", __name__)

# REQUEST SESSION
@sessions_bp.route("/request", methods=["POST"])
@jwt_required()
@profile_complete_required
def request_session():
    data = request.get_json()
    user_id = get_jwt_identity()

    match = Match.query.get(data.get("match_id"))
    if not match:
        return jsonify({"error": "Match not found"}), 404
      # Session model additions

    subject = data.get("subject")
    session_type = data.get("session_type")    

    session = Session (
        match_id=match.id,
        tutor_id=match.tutor_id,
        tutee_id=match.tutee_id,
        session_date=data.get("session_date"),
        duration=data.get("duration"),
        subject = data.get("subject"),
        session_type = data.get("session_type")
    )
    db.session.add(session)

      # Notify tutor
    notif = Notification(
        user_id=match.tutor_id,
        message=f"New session request for {subject} ({session_type})"
    )
    
    db.session.add(notif)
    db.session.commit()
    return jsonify({"message": "Session requested", "session_id": session.id}), 201

# ACCEPT SESSION
@sessions_bp.route("/<int:session_id>/accept", methods=["POST"])
@jwt_required()
def accept_session(session_id):
    user_id = get_jwt_identity()
    session = Session.query.get_or_404(session_id)

    if session.tutor_id != int(user_id):
        return jsonify({"error": "Only tutor can accept"}), 403

    session.status = "accepted"

    notif = Notification(user_id=session.tutee_id, message="Your session has been accepted")
    db.session.add(notif)
    db.session.commit()

    return jsonify({"message": "Session accepted"})

# REJECT SESSION
@sessions_bp.route("/<int:session_id>/reject", methods=["POST"])
@jwt_required()
def reject_session(session_id):
    user_id = get_jwt_identity()
    session = Session.query.get_or_404(session_id)

    if session.tutor_id != int(user_id):
        return jsonify({"error": "Only tutor can reject"}), 403

    session.status = "rejected"

    notif = Notification(user_id=session.tutee_id, message="Your session has been rejected")
    db.session.add(notif)
    db.session.commit()

    return jsonify({"message": "Session rejected"})

# COMPLETE SESSION
@sessions_bp.route("/<int:session_id>/complete", methods=["POST"])
@jwt_required()
def complete_session(session_id):
    user_id = get_jwt_identity()
    session = Session.query.get_or_404(session_id)

    if session.tutor_id != int(user_id):
        return jsonify({"error": "Only tutor can complete"}), 403

    session.status = "completed"

    try:
        from ..models import Tutor, Wallet, Transaction
        tutor_profile = Tutor.query.filter_by(user_id=session.tutor_id).first()
        duration_hours = (session.duration or 60) / 60.0
        hourly_rate = tutor_profile.hourly_rate if tutor_profile and tutor_profile.hourly_rate else 0.0
        amount = duration_hours * hourly_rate
        
        # Deduct from tutee's wallet
        tutee_wallet = Wallet.query.filter_by(user_id=session.tutee_id).first()
        if not tutee_wallet:
            tutee_wallet = Wallet(user_id=session.tutee_id, balance=0.0)
            db.session.add(tutee_wallet)
        
        tutee_wallet.balance -= amount
        tutee_transaction = Transaction(wallet_id=tutee_wallet.id, amount=-amount, transaction_type='debit', description=f'Payment for session {session.id}', session_id=session.id)
        db.session.add(tutee_transaction)

        # Add to tutor's wallet
        tutor_wallet = Wallet.query.filter_by(user_id=session.tutor_id).first()
        if not tutor_wallet:
            tutor_wallet = Wallet(user_id=session.tutor_id, balance=0.0)
            db.session.add(tutor_wallet)
        
        tutor_wallet.balance += amount
        tutor_transaction = Transaction(wallet_id=tutor_wallet.id, amount=amount, transaction_type='credit', description=f'Earnings for session {session.id}', session_id=session.id)
        db.session.add(tutor_transaction)
    except Exception as e:
        print("Finances calculation error:", e)

    notif = Notification(user_id=session.tutee_id, message="Your session has been completed")
    db.session.add(notif)
    db.session.commit()

    return jsonify({"message": "Session completed"})

# GET MY SESSIONS
@sessions_bp.route("/my", methods=["GET"])
@jwt_required()
def my_sessions():
    user_id = int(get_jwt_identity())
    sessions = Session.query.filter(
        (Session.tutor_id == user_id) | (Session.tutee_id == user_id)
    ).all()

    return jsonify([{
        "id": s.id,
        "match_id": s.match_id,
        "status": s.status,
        "date": s.session_date.isoformat() if s.session_date else None,
        "duration": s.duration
    } for s in sessions])

# GET SESSIONS BY STATUS
@sessions_bp.route("/", methods=["GET"])
@jwt_required()
def get_sessions():
    user_id = int(get_jwt_identity())
    status = request.args.get("status")
    query = Session.query.filter((Session.tutor_id == user_id) | (Session.tutee_id == user_id))
    if status:
        query = query.filter(Session.status == status)
    sessions = query.all()

    return jsonify([{
        "id": s.id,
        "match_id": s.match_id,
        "tutor_id": s.tutor_id,
        "tutor_role": s.tutor.role if s.tutor else None,
        "tutee_id": s.tutee_id,
        "tutee_role": s.tutee.role if s.tutee else None,
        "status": s.status,
        "date": s.session_date.isoformat() if s.session_date else None,
        "duration": s.duration
    } for s in sessions])