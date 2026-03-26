# app/utils/decorators.py
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity
from app.models import User

def profile_complete_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Student: require username and university
        if user.role == "student":
            if not user.username or not user.university_id:
                return jsonify({"error": "Complete your profile before using this feature"}), 403

        # Tutor: require username, university, subjects, experience
        if user.role == "tutor":
            tutor = user.tutor_profile
            if not user.username or not user.university_id or not tutor or not tutor.subjects or not tutor.experience_level:
                return jsonify({"error": "Complete your tutor profile before using this feature"}), 403

        return f(*args, **kwargs)
    return decorated_function