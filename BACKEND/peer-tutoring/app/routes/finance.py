from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, Wallet, Transaction, User, Session, Tutor
from datetime import datetime

finance_bp = Blueprint("finance", __name__)

@finance_bp.route("/wallet", methods=["GET", "OPTIONS"])
@jwt_required()
def get_wallet():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    user_id = int(get_jwt_identity())
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet:
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.session.add(wallet)
        db.session.commit()
    
    transactions = Transaction.query.filter_by(wallet_id=wallet.id).order_by(Transaction.created_at.desc()).limit(20).all()
    trans_list = []
    for t in transactions:
        trans_list.append({
            "id": t.id,
            "amount": t.amount,
            "type": t.transaction_type,
            "description": t.description,
            "date": t.created_at.strftime("%d %b %Y")
        })

    return jsonify({
        "balance": {"available": wallet.balance, "totalSpent": 0},
        "transactions": trans_list,
        "paymentMethods": []
    })

@finance_bp.route("/wallet/topup", methods=["POST", "OPTIONS"])
@jwt_required()
def topup_wallet():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json()
    amount = float(data.get("amount", 0.0))
    user_id = int(get_jwt_identity())
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet:
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.session.add(wallet)
    
    wallet.balance += amount
    t = Transaction(wallet_id=wallet.id, amount=amount, transaction_type='credit', description='Top-up')
    db.session.add(t)
    db.session.commit()
    return jsonify({"message": "Top-up successful", "amount": amount})

@finance_bp.route("/earnings", methods=["GET", "OPTIONS"])
@jwt_required()
def get_earnings():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    user_id = int(get_jwt_identity())
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet:
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.session.add(wallet)
        db.session.commit()
    
    transactions = Transaction.query.filter_by(wallet_id=wallet.id).order_by(Transaction.created_at.desc()).limit(20).all()
    trans_list = []
    total_earned = 0
    for t in transactions:
        trans_list.append({
            "id": t.id,
            "amount": t.amount,
            "type": t.transaction_type,
            "description": t.description,
            "date": t.created_at.strftime("%d %b %Y")
        })
        if t.amount > 0:
            total_earned += t.amount

    return jsonify({
        "balance": {"available": wallet.balance, "pending": 0, "thisMonth": 0, "total": total_earned},
        "transactions": trans_list,
        "paymentMethods": [],
        "analytics": []
    })

@finance_bp.route("/earnings/withdraw", methods=["POST", "OPTIONS"])
@jwt_required()
def withdraw_funds():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    data = request.get_json()
    amount = float(data.get("amount", 0.0))
    user_id = int(get_jwt_identity())
    wallet = Wallet.query.filter_by(user_id=user_id).first()
    if not wallet or wallet.balance < amount:
        return jsonify({"error": "Insufficient funds"}), 400
        
    wallet.balance -= amount
    t = Transaction(wallet_id=wallet.id, amount=-amount, transaction_type='debit', description='Withdrawal')
    db.session.add(t)
    db.session.commit()
    return jsonify({"message": "Withdrawal requested", "amount": amount})

