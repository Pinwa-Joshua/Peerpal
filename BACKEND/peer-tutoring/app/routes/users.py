import cloudinary.uploader 
from sqlalchemy import or_
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
from ..database import db
from ..models import User, Tutor, RevokedToken, Notification, PasswordResetToken
from ..utils.auth import hash_password, verify_password
import secrets
from flask_mail import Message
from .. import mail

users_bp = Blueprint("users", __name__)

# REGISTER
@users_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "Email already exists"}), 400

    user = User(
        username=data["username"],
        email=data["email"],
        password_hash=hash_password(data["password"]),
        role=data.get("role", "student"),
        profile_picture=data.get("profile_picture"),
        university_id=data.get("university_id")
    )
    db.session.add(user)
    db.session.commit()

    # Create Tutor profile if role=tutor
    if user.role == "tutor":
        tutor = Tutor(
            user_id=user.id,
            subjects=data.get("subjects", ""),
            experience_level=data.get("experience_level", "")
        )
        db.session.add(tutor)
        db.session.commit()

    return jsonify({"message": "User registered"}), 201

# LOGIN
@users_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data["email"]).first()

    if user is None or not verify_password(user.password_hash, data["password"]):
        return jsonify({"error": "Invalid credentials"}), 401

    if user.banned_until and user.banned_until > datetime.utcnow():
        return jsonify({"error": f"Account banned until {user.banned_until}"}), 403

    token = create_access_token(identity=str(user.id))
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
        "role": "tutor" if user.tutor_profile else "student",
        "average_rating": user.average_rating,
        "profile_picture": user.profile_picture,
        "rating_count": user.rating_count,  "university": {
        "id": user.university.id,
        "name": user.university.name
    } if user.university else None
    })

# UPDATE PROFILE
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
    if data.get("profile_picture"):
        user.profile_picture = data["profile_picture"]
    if data.get("university_id"):
        user.university_id = data["university_id"]


    db.session.commit()
    return jsonify({"message": "Profile updated"})



@users_bp.route("/upload-profile-picture", methods=["POST"])
@jwt_required()
def upload_profile_picture():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files['file']

    # Upload to Cloudinary
    result = cloudinary.uploader.upload(
        file,
        folder="profile_pictures",
        public_id=f"user_{user.id}",
        overwrite=True,
        resource_type="image"
    )

    user.profile_picture = result["secure_url"]
    db.session.commit()

    return jsonify({"message": "Profile picture updated", "url": user.profile_picture})@users_bp.route("/search", methods=["GET"])

# SEARCH USERS
@users_bp.route("/search", methods=["GET"])
def search_users():
    name = request.args.get("name")
    subjects = request.args.get("subject")  # can be comma-separated
    university_id = request.args.get("university_id")

    query = User.query

    if name:
        query = query.filter(User.username.ilike(f"%{name}%"))

    if university_id:
        query = query.filter(User.university_id == university_id)

    if subjects:
        subject_list = [s.strip() for s in subjects.split(",")]
        query = query.join(Tutor).filter(
            or_(*[Tutor.subjects.ilike(f"%{s}%") for s in subject_list])
        )

    results = query.all()
    return jsonify([{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "role": "tutor" if u.tutor_profile else "student",
        "average_rating": u.average_rating,
        "rating_count": u.rating_count
    } for u in results])


# FORGOT PASSWORD
@users_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        # Don't reveal if email exists or not for security
        return jsonify({"message": "If an account with that email exists, a reset link has been sent."}), 200
    
    # Generate token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=token,
        expires_at=expires_at
    )
    db.session.add(reset_token)
    db.session.commit()
    
    # Send email
    reset_url = f"http://localhost:5173/reset-password?token={token}"
    msg = Message(
        "Password Reset Request - PeerPal",
        sender="noreply@peerpal.com",
        recipients=[email]
    )
    msg.body = f"""Hi {user.username},

You requested a password reset for your PeerPal account.

Click the link below to reset your password:
{reset_url}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Best,
The PeerPal Team
"""
    mail.send(msg)
    
    return jsonify({"message": "If an account with that email exists, a reset link has been sent."}), 200


# RESET PASSWORD
@users_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("password")
    
    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400
    
    reset_token = PasswordResetToken.query.filter_by(token=token, used=False).first()
    if not reset_token:
        return jsonify({"error": "Invalid or expired token"}), 400
    
    if reset_token.expires_at < datetime.utcnow():
        return jsonify({"error": "Token has expired"}), 400
    
    # Update password
    user = reset_token.user
    user.set_password(new_password)
    
    # Mark token as used
    reset_token.used = True
    
    db.session.commit()
    
    return jsonify({"message": "Password reset successfully"}), 200