from flask import jsonify, request, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.database import db

quiz_bp = Blueprint("quiz", __name__)

@quiz_bp.route("/determine-style", methods=["POST"])
@jwt_required()
def determine_style():
    data = request.get_json()
    answers = data.get("answers")

    scores = {
        "visual": 0,
        "auditory": 0,
        "reading": 0,
        "kinesthetic": 0
    }

    for answer in answers.values():
        scores[answer] += 1

    style = max(scores, key=scores.get)

    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    user.learner_style = style
    db.session.commit()

    return jsonify({"style": style})