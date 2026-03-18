from flask import Blueprint, request, jsonify
from datetime import datetime
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from ..database import db
from ..models import User, Tutor, RevokedToken
from ..utils.auth import hash_password, verify_password

users_bp = Blueprint("users", __name__)

#REGISTER
@users_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400

    user = User(
        username=data["username"],
        email=data["email"],
        password_hash=hash_password(data["password"]),
        role= data.get("role", "student")
    )

    db.session.add(user)
    db.session.commit()

    # For if the user registers as a tutor 
    if user.role == "tutor":
        tutor = Tutor(
            user_id=user.id,
            subjects=data.get("subjects", ""),
            experience_level=data.get("experience_level", "")
        )
        db.session.add(tutor)
        db.session.commit()

    return jsonify({"message": "User registered"}), 201

#LOGIN 
@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()
    
    if user.banned_until and user.banned_until > datetime.utcnow():
        return jsonify({"error": "Account banned until " + str(user.banned_until)}), 403
    
    if not user or not verify_password(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    token =create_access_token(identity=str(user.id)) 

    return jsonify({"access_token": token})

# LOGOUT

@users_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    revoked = RevokedToken(jti=jti)
    db.session.add(revoked)
    db.session.commit()
    return jsonify({"msg": "Successfully logged out"}), 200

# CURRENT USER
@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": "tutor" if user.tutor_profile else "tutee",
        "average_rating": user.average_rating,
        "rating_count": user.rating_count
    })

@users_bp.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():

    user_id = get_jwt_identity()

    data = request.get_json()

    user = User.query.get(user_id)

    if data.get("username"):
        user.username = data["username"]

    if data.get("email"):
        user.email = data["email"]

    if data.get("password"):
        user.set_password(data["password"])

    db.session.commit()

    return jsonify({"message": "Profile updated"})
