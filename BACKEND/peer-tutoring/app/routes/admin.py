from flask import Blueprint, jsonify, request
from datetime import datetime,timedelta
from flask_jwt_extended import jwt_required
from app.models import User, Tutor,Session,Match,Feedback,Notification,University
from app.database import db
from app.utils.admin_required import admin_required

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/")
@jwt_required()
@admin_required()
def admin_home():
    return jsonify({"message": "Admin route working"})


# View all users
@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@admin_required()
def get_all_users():
    users = User.query.all()

    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": u.role
    } for u in users])

# View all universities
@admin_bp.route("/universities", methods=["GET"])
@jwt_required()
@admin_required()
def get_universities():
    universities = University.query.all()
    return jsonify([u.to_dict() for u in universities])


# Add a new university
@admin_bp.route("/universities", methods=["POST"])
@jwt_required()
@admin_required()
def add_university():
    data = request.get_json()
    name = data.get("name")
    country = data.get("country")

    if not name:
        return jsonify({"error": "University name is required"}), 400

    if University.query.filter_by(name=name).first():
        return jsonify({"error": "University already exists"}), 400

    uni = University(name=name, country=country)
    db.session.add(uni)
    db.session.commit()

    return jsonify({"message": "University added", "university": uni.to_dict()}), 201


# Update a university
@admin_bp.route("/universities/<int:university_id>", methods=["PUT"])
@jwt_required()
@admin_required()
def update_university(university_id):
    uni = University.query.get_or_404(university_id)
    data = request.get_json()

    name = data.get("name")
    country = data.get("country")

    if name:
        uni.name = name
    if country:
        uni.country = country

    db.session.commit()
    return jsonify({"message": "University updated", "university": uni.to_dict()})


# Delete a university
@admin_bp.route("/universities/<int:university_id>", methods=["DELETE"])
@jwt_required()
@admin_required()
def delete_university(university_id):
    uni = University.query.get_or_404(university_id)
    db.session.delete(uni)
    db.session.commit()
    return jsonify({"message": "University deleted"})

# Delete user
@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@admin_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted"})


# View all tutors
@admin_bp.route("/tutors", methods=["GET"])
@jwt_required()
@admin_required()
def get_all_tutors():
    tutors = Tutor.query.all()

    return jsonify([{
        "user_id": t.user_id,
        "subjects": t.subjects,
        "experience_level": t.experience_level
    } for t in tutors])

#verify tutors
@admin_bp.route("/verify-tutor/<int:user_id>", methods=["PUT"])
@jwt_required()
@admin_required()
def verify_tutor(user_id):

    tutor = Tutor.query.filter_by(user_id=user_id).first()

    if not tutor:
        return jsonify({"error": "Tutor not found"}), 404

    tutor.verified = True
    db.session.commit()

    return jsonify({"message": "Tutor verified"})

# platform statistics endpoint (of sorts)
@admin_bp.route("/stats", methods=["GET"])
@jwt_required()
@admin_required()
def platform_stats():

    users = User.query.count()
    tutors = Tutor.query.count()

    return jsonify({
        "total_users": users,
        "total_tutors": tutors
    })

@admin_bp.route("/sessions", methods=["GET"])
@jwt_required()
@admin_required()
def get_all_sessions():

    status = request.args.get("status")
    query = Session.query
    if status:
     query = query.filter(Session.status == status)

    sessions = query.all() 
    return jsonify([
    {
        "session_id": s.id,
        "match_id": s.match_id,
        "tutor_id": s.tutor_id,
        "tutor_role": s.tutor.role,
        "tutee_id": s.tutee_id,
        "tutee_role": s.tutee.role,
        "session_date": s.session_date,
        "duration": s.duration,
        "status": s.status
    }
    for s in sessions
])

@admin_bp.route("/ban/<int:user_id>", methods=["POST"])
@jwt_required()
@admin_required()
def ban_user(user_id):

    data = request.get_json()
    days = data.get("days", 0)

    user = User.query.get_or_404(user_id)

    if days > 0:
        user.banned_until = datetime.utcnow() + timedelta(days=days)
    else:
        user.banned_until = None  # permanent ban not using days

    db.session.commit()

    return jsonify({"message": "User banned", "banned_until": user.banned_until})

@admin_bp.route("/notifications", methods=["GET"])
@jwt_required()
@admin_required()
def admin_notifications():
    notifications = Notification.query.filter_by(user_id=None).all()  # or system-wide
    return jsonify([n.to_dict() for n in notifications])
@admin_bp.route("/analytics", methods=["GET"])
@jwt_required()
@admin_required()
def analytics():

    users = User.query.count()
    tutors = Tutor.query.count()
    sessions = Session.query.count()
    feedbacks = Feedback.query.count()
    matches = Match.query.count()

    return jsonify({
        "users": users,
        "tutors": tutors,
        "sessions": sessions,
        "feedbacks": feedbacks,
        "matches": matches
    })

# admin_routes.py (or inside your admin_bp)


@admin_bp.route("/user_history/<int:user_id>", methods=["GET"])
@jwt_required()
@admin_required()
def user_history(user_id):
    user = User.query.get_or_404(user_id)

    # Tutor profile
    tutor_profile = None
    if user.tutor_profile:
        tutor_profile = {
            "subjects": user.tutor_profile.subjects,
            "experience_level": user.tutor_profile.experience_level,
            "availability": user.tutor_profile.availability,
            "active": user.tutor_profile.active
        }

    # Matches where user is tutor or tutee
    matches_as_tutor = Match.query.filter_by(tutor_id=user.id).all()
    matches_as_tutee = Match.query.filter_by(tutee_id=user.id).all()

    # Sessions
    sessions = []
    for match in matches_as_tutor + matches_as_tutee:
        for session in match.sessions:
            sessions.append({
                "session_id": session.id,
                "match_id": match.id,
                "date": session.session_date,
                "duration": session.duration
            })

    # Feedbacks
    feedbacks_sent = [{
        "to_user_id": f.to_user_id,
        "rating": f.rating,
        "comment": f.comment,
        "session_id": f.session_id,
        "created_at": f.created_at
    } for f in user.sent_feedbacks]

    feedbacks_received = [{
        "from_user_id": f.from_user_id,
        "rating": f.rating,
        "comment": f.comment,
        "session_id": f.session_id,
        "created_at": f.created_at
    } for f in user.received_feedbacks]

    # Progress
    progress_entries = []
    for match in matches_as_tutor + matches_as_tutee:
        for session in match.sessions:
            for progress in session.progress_entries:
                progress_entries.append({
                    "topic": progress.topic,
                    "pre_score": progress.pre_score,
                    "post_score": progress.post_score,
                    "improvement": progress.improvement,
                    "date": progress.created_at
                })

    return jsonify({
        "user_id": user.id,
        "full_name": getattr(user, "full_name", ""),
        "email": user.email,
        "role": user.role,
        "banned_until": getattr(user, "banned_until", None),
        "tutor_profile": tutor_profile,
        "matches_as_tutor": [m.id for m in matches_as_tutor],
        "matches_as_tutee": [m.id for m in matches_as_tutee],
        "sessions": sessions,
        "feedbacks_sent": feedbacks_sent,
        "feedbacks_received": feedbacks_received,
        "progress_entries": progress_entries
    })