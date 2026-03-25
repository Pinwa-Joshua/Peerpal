from flask import jsonify,Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Notification
from app.database import db

notifications_bp = Blueprint("notifications", __name__)

# Get notifications
@notifications_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():
    user_id = get_jwt_identity()

    notifications = Notification.query.filter_by(user_id=user_id).all()
    return jsonify([n.to_dict() for n in notifications])


# Mark as read
@notifications_bp.route("/<int:id>/read", methods=["PUT"])
@jwt_required()
def mark_as_read(id):
    notif = Notification.query.get_or_404(id)
    notif.is_read = True
    db.session.commit()

    return jsonify({"message": "Marked as read"})