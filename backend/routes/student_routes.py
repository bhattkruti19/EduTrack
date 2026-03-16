from flask import Blueprint, jsonify, request
from pymongo.errors import DuplicateKeyError

from models.student_model import create_student, delete_student, get_all_students, get_student_by_id, update_student

student_bp = Blueprint("students", __name__, url_prefix="/api/students")


def _to_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


# Return all student documents for the frontend dashboard.
@student_bp.route("", methods=["GET"])
def get_students():
    try:
        return jsonify(get_all_students())
    except Exception as error:
        return jsonify({"error": f"Failed to fetch students: {str(error)}"}), 500


# Return one student document by MongoDB ObjectId.
@student_bp.route("/<string:student_id>", methods=["GET"])
def get_student(student_id):
    try:
        student = get_student_by_id(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        return jsonify(student)
    except Exception as error:
        return jsonify({"error": f"Failed to fetch student: {str(error)}"}), 500


# Create a new student profile document.
@student_bp.route("", methods=["POST"])
def create_student_route():
    try:
        data = request.get_json(silent=True) or {}
        required_fields = [
            "student_id",
            "name",
            "enrollment_id",
            "branch",
            "year",
            "semester",
            "email",
        ]
        missing = [field for field in required_fields if not data.get(field)]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        payload = {
            "student_id": str(data.get("student_id", "")).strip(),
            "name": str(data.get("name", "")).strip(),
            "enrollment_id": str(data.get("enrollment_id", "")).strip(),
            "branch": str(data.get("branch", "")).strip(),
            "year": str(data.get("year", "")).strip(),
            "semester": str(data.get("semester", "")).strip(),
            "email": str(data.get("email", "")).strip().lower(),
            "cgpa": _to_float(data.get("cgpa"), 0.0),
            "attendance_percentage": _to_float(data.get("attendance_percentage"), 0.0),
        }

        student = create_student(payload)
        return jsonify({"message": "Student created successfully", "student": student}), 201
    except DuplicateKeyError:
        return jsonify({"error": "student_id, enrollment_id or email already exists"}), 409
    except Exception as error:
        return jsonify({"error": f"Failed to create student: {str(error)}"}), 500


# Update an existing student profile using its MongoDB ObjectId.
@student_bp.route("/<string:student_id>", methods=["PUT"])
def update_student_route(student_id):
    try:
        existing_student = get_student_by_id(student_id)
        if not existing_student:
            return jsonify({"error": "Student not found"}), 404

        data = request.get_json(silent=True) or {}
        payload = {}
        for field in ["student_id", "name", "enrollment_id", "branch", "year", "semester", "email"]:
            if field in data and data[field] is not None:
                value = str(data[field]).strip()
                payload[field] = value.lower() if field == "email" else value

        if "cgpa" in data:
            payload["cgpa"] = _to_float(data.get("cgpa"), existing_student.get("cgpa", 0.0))
        if "attendance_percentage" in data:
            payload["attendance_percentage"] = _to_float(
                data.get("attendance_percentage"), existing_student.get("attendance_percentage", 0.0)
            )

        student = update_student(student_id, payload)
        return jsonify({"message": "Student updated successfully", "student": student})
    except DuplicateKeyError:
        return jsonify({"error": "student_id, enrollment_id or email already exists"}), 409
    except Exception as error:
        return jsonify({"error": f"Failed to update student: {str(error)}"}), 500


# Delete a student profile using its MongoDB ObjectId.
@student_bp.route("/<string:student_id>", methods=["DELETE"])
def delete_student_route(student_id):
    try:
        if not delete_student(student_id):
            return jsonify({"error": "Student not found"}), 404
        return jsonify({"message": "Student deleted successfully"})
    except Exception as error:
        return jsonify({"error": f"Failed to delete student: {str(error)}"}), 500
