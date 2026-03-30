from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import User, Tutor, TimeSlot

tutors_bp = Blueprint("tutors", __name__)

# GET ALL TUTORS
@tutors_bp.route("/create", methods=["OPTIONS", "POST"])
def create_tutor_profile():
    if request.method == "OPTIONS":
        return jsonify({}), 200
        
    @jwt_required()
    def _create():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        tutor = Tutor.query.filter_by(user_id=user_id).first()
        if not tutor:
            tutor = Tutor(user_id=user_id)
            db.session.add(tutor)
            
        subjects = data.get('subjects', [])
        if isinstance(subjects, list):
            tutor.subjects = ', '.join(subjects)
        else:
            tutor.subjects = subjects
            
        tutor.experience_level = data.get('experience_level', 'Intermediate')
        
        # Make sure user role is updated to tutor
        user = User.query.get(user_id)
        if user and user.role != 'tutor':
            user.role = 'tutor'
            
        db.session.commit()
        return jsonify({"message": "Profile created successfully"}), 201

    return _create()

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


# GET TUTOR AVAILABILITY (time slots)
@tutors_bp.route("/availability", methods=["GET"])
@jwt_required()
def get_availability():
    user_id = get_jwt_identity()
    tutor = Tutor.query.filter_by(user_id=user_id).first()
    if not tutor:
        return jsonify({"error": "Tutor profile not found"}), 404
    
    time_slots = TimeSlot.query.filter_by(tutor_id=tutor.id).all()
    availability = {}
    for slot in time_slots:
        if slot.day_of_week not in availability:
            availability[slot.day_of_week] = []
        if slot.is_available:
            availability[slot.day_of_week].append(slot.time_block)
    
    return jsonify(availability), 200


# UPDATE TUTOR AVAILABILITY (time slots)
@tutors_bp.route("/availability", methods=["PUT"])
@jwt_required()
def update_availability():
    user_id = get_jwt_identity()
    tutor = Tutor.query.filter_by(user_id=user_id).first()
    if not tutor:
        return jsonify({"error": "Tutor profile not found"}), 404
    
    data = request.get_json()
    # data should be like: {"Monday": ["Morning", "Afternoon"], "Tuesday": [], ...}
    
    # Clear existing time slots
    TimeSlot.query.filter_by(tutor_id=tutor.id).delete()
    
    # Add new time slots
    for day, blocks in data.items():
        for block in blocks:
            time_slot = TimeSlot(
                tutor_id=tutor.id,
                day_of_week=day,
                time_block=block,
                is_available=True
            )
            db.session.add(time_slot)
    
    db.session.commit()
    return jsonify({"message": "Availability updated successfully"}), 200