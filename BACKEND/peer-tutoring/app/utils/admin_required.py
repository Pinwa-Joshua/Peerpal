from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from flask import jsonify
from app.models import User

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user or user.role != "admin":
                return jsonify({"error": "Admin access required"}), 403

            return fn(*args, **kwargs)
        return decorator
    return wrapper