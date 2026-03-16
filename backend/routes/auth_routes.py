import bcrypt
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from models import db
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register_user():
    """API: Register a new student/faculty user with bcrypt-hashed password."""
    try:
        data = request.get_json(silent=True) or {}
        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        role = data.get("role", "").strip().lower()

        if not all([name, email, password, role]):
            return jsonify({"error": "name, email, password and role are required"}), 400

        if role not in {"student", "faculty"}:
            return jsonify({"error": "role must be either student or faculty"}), 400

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User already exists with this email"}), 409

        password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        new_user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            role=role,
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully", "user": new_user.to_dict()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to register user: {str(error)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login_user():
    """API: Login a user and return a JWT access token."""
    try:
        data = request.get_json(silent=True) or {}
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")

        if not email or not password:
            return jsonify({"error": "email and password are required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        is_valid_password = bcrypt.checkpw(
            password.encode("utf-8"), user.password_hash.encode("utf-8")
        )
        if not is_valid_password:
            return jsonify({"error": "Invalid email or password"}), 401

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={"role": user.role, "email": user.email},
        )

        return jsonify(
            {
                "message": "Login successful",
                "access_token": access_token,
                "user": user.to_dict(),
            }
        )
    except Exception as error:
        return jsonify({"error": f"Failed to login: {str(error)}"}), 500


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """API: Get profile details of the authenticated user from JWT identity."""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({"user": user.to_dict()})
    except Exception as error:
        return jsonify({"error": f"Failed to fetch profile: {str(error)}"}), 500
