from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Tutor, User

tutors_bp = Blueprint("tutors", __name__)

@tutors_bp.route("/")
def tutors_home():
    return {"message": "Tutors route working"}

@tutors_bp.route("/profile", methods=["POST"])
@jwt_required()
def create_profile():
    """
    Create or update a tutor profile for the current user.
    Users can have multiple subjects by comma separation.
    """
    user_id = get_jwt_identity()
    data = request.json

    # Ensure subjects is a string
    subjects = data.get("subjects")
    if not subjects or not isinstance(subjects, str):
        return jsonify({"error": "Subjects must be a non-empty string"}), 400

    experience_level = data.get("experience_level", "beginner")

    # Check if user already has a tutor profile
    tutor = Tutor.query.filter_by(user_id=user_id).first()
    if tutor:
        # Update existing profile
        tutor.subjects = subjects
        tutor.experience_level = experience_level
    else:
        # Create new profile
        tutor = Tutor(
            user_id=user_id,
            subjects=subjects,
            experience_level=experience_level
        )
        db.session.add(tutor)

    db.session.commit()
    return jsonify({"message": "Tutor profile created/updated"}), 201


@tutors_bp.route("/list", methods=["GET"])
def list_tutors():
    """
    List all tutors, optionally filtered by subject.
    Users can be tutors in some subjects and tutees in others.
    """
    subject = request.args.get("subject", "").strip()

    query = Tutor.query
    if subject:
        # Case-insensitive match
        query = query.filter(Tutor.subjects.ilike(f"%{subject}%"))

    tutors = query.all()

    result = []
    for t in tutors:
        # Defensive: t.user might not exist if the relationship is broken
        user = t.user
        result.append({
            "tutor_id": t.user_id,
            "username": user.username if user else "",
            "subjects": t.subjects,
            "experience_level": t.experience_level,
            "availability": t.availability,
            "rating": user.average_rating if user else 0
        })

    return jsonify(result)
