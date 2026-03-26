from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..database import db
from ..models import Message

messages_bp = Blueprint("messages", __name__)

@messages_bp.route("/send", methods=["POST"])
@jwt_required()
def send_message():
    data = request.get_json()
    msg = Message(
        sender_id=get_jwt_identity(),
        receiver_id=data["receiver_id"],
        content=data["content"]
    )
    db.session.add(msg)
    db.session.commit()
    return jsonify({"message": "Message sent"})

@messages_bp.route("/inbox", methods=["GET"])
@jwt_required()
def inbox():
    user_id = get_jwt_identity()
    msgs = Message.query.filter_by(receiver_id=user_id).all()
    return jsonify([{
        "id": m.id,
        "sender_id": m.sender_id,
        "content": m.content,
        "timestamp": m.timestamp
    } for m in msgs])
    
@messages_bp.route("/thread/<int:user_id>", methods=["GET"])
@jwt_required()
def get_thread(user_id):

    current_user = get_jwt_identity()

    messages = Message.query.filter(
        ((Message.sender_id == current_user) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user))
    ).order_by(Message.timestamp.asc()).all()

    return jsonify([
        {
            "sender_id": m.sender_id,
            "receiver_id": m.receiver_id,
            "content": m.content,
            "timestamp": m.timestamp
        }
        for m in messages
    ])

