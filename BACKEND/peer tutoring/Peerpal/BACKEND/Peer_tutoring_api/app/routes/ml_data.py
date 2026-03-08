from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.models import Progress, Session, User
from app.database import db

ml_data_bp = Blueprint("ml_data", __name__)

@ml_data_bp.route("/training-data", methods=["GET"])
@jwt_required()
def training_data():

    data = db.session.query(
        Progress.pre_score,
        Progress.post_score,
        Progress.improvement,
        Session.duration,
        User.average_rating
    ).join(Session).join(User, Session.tutor_id == User.id).all()

    dataset = [
        {
            "pre_score": d[0],
            "post_score": d[1],
            "improvement": d[2],
            "duration": d[3],
            "tutor_rating": d[4]
        }
        for d in data
    ]

    return jsonify(dataset)