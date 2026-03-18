from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Feedback, User, Session
from sqlalchemy.exc import IntegrityError

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/submit", methods=["POST"])
@jwt_required()
def submit_feedback():
    data = request.get_json()
    user_id = get_jwt_identity()

    if not data.get("to_user_id") or not data.get("rating"):
        return jsonify({"error": "to_user_id and rating required"}), 400

    rating = float(data["rating"])
    if rating < 1 or rating > 5:
        return jsonify({"error": "Rating must be 1-5"}), 400

    session_id = data.get("session_id")
    if session_id and not Session.query.get(session_id):
        return jsonify({"error": "Session not found"}), 404

    if user_id == data["to_user_id"]:
        return jsonify({"error": "Cannot rate yourself"}), 400

    feedback = Feedback(
        from_user_id=user_id,
        to_user_id=data["to_user_id"],
        session_id=session_id,
        rating=rating,
        comment=data.get("comment")
    )


    try:
        db.session.add(feedback)
        rated_user = User.query.get(data["to_user_id"])
        total_rating = rated_user.average_rating * rated_user.rating_count
        rated_user.rating_count += 1
        rated_user.average_rating = (total_rating + rating) / rated_user.rating_count
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Feedback already submitted"}), 400

    return jsonify({"message": "Feedback submitted"})
