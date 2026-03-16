from flask import Blueprint, jsonify, request

from models import db
from models.attendance import Attendance
from models.student import Student

attendance_bp = Blueprint("attendance", __name__, url_prefix="/api/attendance")


def _calculate_attendance_percentage(attended_classes, total_classes):
    if total_classes <= 0:
        return 0.0
    return round((attended_classes / total_classes) * 100, 2)


@attendance_bp.route("/<int:student_id>", methods=["GET"])
def get_attendance_by_student(student_id):
    """API: Get all subject-wise attendance records for a student."""
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404

        records = Attendance.query.filter_by(student_id=student_id).all()
        return jsonify([record.to_dict() for record in records])
    except Exception as error:
        return jsonify({"error": f"Failed to fetch attendance: {str(error)}"}), 500


@attendance_bp.route("", methods=["POST"])
def create_attendance_record():
    """API: Create a subject-wise attendance record for a student."""
    try:
        data = request.get_json(silent=True) or {}
        required_fields = ["student_id", "subject", "attended_classes", "total_classes"]
        missing = [field for field in required_fields if field not in data]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        student = Student.query.get(data.get("student_id"))
        if not student:
            return jsonify({"error": "Student not found"}), 404

        attended_classes = int(data.get("attended_classes", 0))
        total_classes = int(data.get("total_classes", 0))
        attendance_percentage = _calculate_attendance_percentage(attended_classes, total_classes)

        record = Attendance(
            student_id=student.id,
            subject=str(data.get("subject", "")).strip(),
            attended_classes=attended_classes,
            total_classes=total_classes,
            attendance_percentage=attendance_percentage,
        )
        db.session.add(record)
        db.session.commit()

        return jsonify({"message": "Attendance record created", "attendance": record.to_dict()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to create attendance record: {str(error)}"}), 500


@attendance_bp.route("/<int:attendance_id>", methods=["PUT"])
def update_attendance_record(attendance_id):
    """API: Update a subject-wise attendance record by attendance id."""
    try:
        record = Attendance.query.get(attendance_id)
        if not record:
            return jsonify({"error": "Attendance record not found"}), 404

        data = request.get_json(silent=True) or {}

        if "subject" in data:
            record.subject = str(data.get("subject", "")).strip()
        if "attended_classes" in data:
            record.attended_classes = int(data.get("attended_classes", 0))
        if "total_classes" in data:
            record.total_classes = int(data.get("total_classes", 0))

        record.attendance_percentage = _calculate_attendance_percentage(
            record.attended_classes,
            record.total_classes,
        )

        db.session.commit()
        return jsonify({"message": "Attendance record updated", "attendance": record.to_dict()})
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to update attendance record: {str(error)}"}), 500
