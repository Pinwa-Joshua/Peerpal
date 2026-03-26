from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

finance_bp = Blueprint("finance", __name__)

@finance_bp.route("/wallet", methods=["GET"])
@jwt_required()
def get_wallet():
    # Mock data for student wallet
    return jsonify({
        "balance": {"available": 450, "totalSpent": 1820},
        "transactions": [
            {"id": 1, "tutor": "Thabo M.", "subject": "Calculus II", "date": "10 Feb 2026", "amount": -120, "status": "completed"},
            {"id": 2, "tutor": "Wallet Top-Up", "subject": "", "date": "8 Feb 2026", "amount": 500, "status": "completed"},
            {"id": 3, "tutor": "Zanele D.", "subject": "Linear Algebra", "date": "3 Feb 2026", "amount": -120, "status": "completed"}
        ],
        "paymentMethods": [
            {"id": 1, "type": "visa", "last4": "4521", "expiry": "09/27"}
        ]
    })

@finance_bp.route("/wallet/topup", methods=["POST"])
@jwt_required()
def topup_wallet():
    data = request.get_json()
    return jsonify({"message": "Top-up successful", "amount": data.get("amount")})

@finance_bp.route("/earnings", methods=["GET"])
@jwt_required()
def get_earnings():
    # Mock data for tutor earnings
    return jsonify({
        "balance": {"available": 2340, "pending": 480, "thisMonth": 1560, "total": 12420},
        "transactions": [
            {"id": 1, "student": "Lerato M.", "subject": "Calculus II", "date": "14 Mar 2026", "amount": 120, "status": "completed"},
            {"id": 2, "student": "David N.", "subject": "Physics I", "date": "13 Mar 2026", "amount": 150, "status": "completed"},
            {"id": 7, "student": "Withdrawal to FNB ••4521", "subject": "", "date": "25 Feb 2026", "amount": -2000, "status": "withdrawn"}
        ],
        "paymentMethods": [
            {"id": 1, "type": "bank", "bank": "FNB", "last4": "4521", "primary": True}
        ],
        "analytics": [
            {"subject": "Calculus II", "earned": 2880, "sessions": 24},
            {"subject": "Data Structures", "earned": 3600, "sessions": 24}
        ]
    })

@finance_bp.route("/earnings/withdraw", methods=["POST"])
@jwt_required()
def withdraw_funds():
    data = request.get_json()
    return jsonify({"message": "Withdrawal requested", "amount": data.get("amount")})
