from flask import Blueprint, jsonify, request
from pymongo.errors import DuplicateKeyError

from models.attendance_model import (
    calculate_attendance_percentage,
    create_attendance,
    get_attendance_by_id,
    get_attendance_by_student_id,
    update_attendance,
)
from models.student_model import get_student_by_identifier

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/attendance")


def _to_int(value, default=0):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


# Return all attendance records for the given student_id.
@attendance_bp.route("/<string:student_id>", methods=["GET"])
def get_attendance(student_id):
    try:
        student = get_student_by_identifier(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        return jsonify(get_attendance_by_student_id(student["student_id"]))
    except Exception as error:
        return jsonify({"error": f"Failed to fetch attendance: {str(error)}"}), 500


# Create a new attendance record and calculate attendance percentage automatically.
@attendance_bp.route("", methods=["POST"])
def create_attendance_route():
    try:
        data = request.get_json(silent=True) or {}
        required_fields = ["student_id", "subject", "attended_classes", "total_classes"]
        missing = [field for field in required_fields if field not in data]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        student = get_student_by_identifier(str(data.get("student_id", "")).strip())
        if not student:
            return jsonify({"error": "Student not found"}), 404

        attended_classes = _to_int(data.get("attended_classes"), 0)
        total_classes = _to_int(data.get("total_classes"), 0)
        payload = {
            "student_id": student["student_id"],
            "subject": str(data.get("subject", "")).strip(),
            "attended_classes": attended_classes,
            "total_classes": total_classes,
            "attendance_percentage": calculate_attendance_percentage(attended_classes, total_classes),
        }
        attendance = create_attendance(payload)
        return jsonify({"message": "Attendance created successfully", "attendance": attendance}), 201
    except DuplicateKeyError:
        return jsonify({"error": "Attendance already exists for this student and subject"}), 409
    except Exception as error:
        return jsonify({"error": f"Failed to create attendance: {str(error)}"}), 500


# Update an attendance record by its MongoDB ObjectId.
@attendance_bp.route("/<string:attendance_id>", methods=["PUT"])
def update_attendance_route(attendance_id):
    try:
        existing_record = get_attendance_by_id(attendance_id)
        if not existing_record:
            return jsonify({"error": "Attendance record not found"}), 404

        data = request.get_json(silent=True) or {}
        payload = {}

        if "student_id" in data:
            student = get_student_by_identifier(str(data.get("student_id", "")).strip())
            if not student:
                return jsonify({"error": "Student not found"}), 404
            payload["student_id"] = student["student_id"]
        if "subject" in data:
            payload["subject"] = str(data.get("subject", "")).strip()
        if "attended_classes" in data:
            payload["attended_classes"] = _to_int(data.get("attended_classes"), 0)
        if "total_classes" in data:
            payload["total_classes"] = _to_int(data.get("total_classes"), 0)

        attended_classes = payload.get("attended_classes", existing_record.get("attended_classes", 0))
        total_classes = payload.get("total_classes", existing_record.get("total_classes", 0))
        payload["attendance_percentage"] = calculate_attendance_percentage(attended_classes, total_classes)

        attendance = update_attendance(attendance_id, payload)
        return jsonify({"message": "Attendance updated successfully", "attendance": attendance})
    except DuplicateKeyError:
        return jsonify({"error": "Attendance already exists for this student and subject"}), 409
    except Exception as error:
        return jsonify({"error": f"Failed to update attendance: {str(error)}"}), 500
