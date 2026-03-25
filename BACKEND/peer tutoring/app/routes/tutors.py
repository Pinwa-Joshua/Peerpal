from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import User, Tutor

tutors_bp = Blueprint("tutors", __name__)

# GET ALL TUTORS
@tutors_bp.route("/", methods=["GET"])
def get_all_tutors():
    tutors = Tutor.query.join(User).all()
    results = []
    for t in tutors:
        results.append({
            "id": t.user.id,
            "username": t.user.username,
            "email": t.user.email,
            "profile_picture": t.user.profile_picture,
            "subjects": t.subjects,
            "experience_level": t.experience_level,
            "average_rating": t.user.average_rating
        })
    return jsonify(results)


# UPDATE TUTOR PROFILE (for logged-in tutor)
@tutors_bp.route("/update", methods=["PUT"])
@jwt_required()
def update_tutor():
    user_id = get_jwt_identity()
    tutor = Tutor.query.filter_by(user_id=user_id).first()
    if not tutor:
        return jsonify({"error": "Tutor profile not found"}), 404

    data = request.get_json()
    if data.get("subjects"):
        tutor.subjects = data["subjects"]
    if data.get("experience_level"):
        tutor.experience_level = data["experience_level"]

    db.session.commit()
    return jsonify({"message": "Tutor profile updated"}), 200


# SEARCH TUTORS (by name or subject)
@tutors_bp.route("/search", methods=["GET"])
def search_tutors():
    name = request.args.get("name")
    subject = request.args.get("subject")
    
    query = Tutor.query.join(User)

    if name:
        query = query.filter(User.username.ilike(f"%{name}%"))
    if subject:
        query = query.filter(Tutor.subjects.ilike(f"%{subject}%"))

    tutors = query.all()
    results = []
    for t in tutors:
        results.append({
            "id": t.user.id,
            "username": t.user.username,
            "email": t.user.email,
            "profile_picture": t.user.profile_picture,
            "subjects": t.subjects,
            "experience_level": t.experience_level,
            "average_rating": t.user.average_rating
        })
    return jsonify(results)