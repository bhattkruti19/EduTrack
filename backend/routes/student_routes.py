from flask import Blueprint, jsonify, request

from models import db
from models.student import Student

student_bp = Blueprint("students", __name__, url_prefix="/api/students")


def _to_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


@student_bp.route("", methods=["GET"])
def get_students():
    """API: Get all student profiles."""
    try:
        students = Student.query.order_by(Student.id.desc()).all()
        return jsonify([student.to_dict() for student in students])
    except Exception as error:
        return jsonify({"error": f"Failed to fetch students: {str(error)}"}), 500


@student_bp.route("/<int:student_id>", methods=["GET"])
def get_student(student_id):
    """API: Get one student profile by student id."""
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404
        return jsonify(student.to_dict())
    except Exception as error:
        return jsonify({"error": f"Failed to fetch student: {str(error)}"}), 500


@student_bp.route("", methods=["POST"])
def create_student():
    """API: Create a new student profile."""
    try:
        data = request.get_json(silent=True) or {}
        required_fields = ["name", "enrollment_id", "branch", "semester", "year", "email"]
        missing = [field for field in required_fields if not data.get(field)]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        if Student.query.filter_by(enrollment_id=data["enrollment_id"].strip()).first():
            return jsonify({"error": "Enrollment ID already exists"}), 409

        if Student.query.filter_by(email=data["email"].strip().lower()).first():
            return jsonify({"error": "Student email already exists"}), 409

        student = Student(
            name=data["name"].strip(),
            enrollment_id=data["enrollment_id"].strip(),
            branch=data["branch"].strip(),
            semester=data["semester"].strip(),
            year=data["year"].strip(),
            email=data["email"].strip().lower(),
            attendance_percentage=_to_float(data.get("attendance_percentage"), 0.0),
            cgpa=_to_float(data.get("cgpa"), 0.0),
        )

        db.session.add(student)
        db.session.commit()
        return jsonify({"message": "Student created", "student": student.to_dict()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to create student: {str(error)}"}), 500


@student_bp.route("/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    """API: Update an existing student profile by id."""
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404

        data = request.get_json(silent=True) or {}

        for field in ["name", "enrollment_id", "branch", "semester", "year", "email"]:
            if field in data and data[field] is not None:
                value = str(data[field]).strip()
                if field == "email":
                    value = value.lower()
                setattr(student, field, value)

        if "attendance_percentage" in data:
            student.attendance_percentage = _to_float(data.get("attendance_percentage"), 0.0)
        if "cgpa" in data:
            student.cgpa = _to_float(data.get("cgpa"), 0.0)

        db.session.commit()
        return jsonify({"message": "Student updated", "student": student.to_dict()})
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to update student: {str(error)}"}), 500


@student_bp.route("/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    """API: Delete a student profile by id."""
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404

        db.session.delete(student)
        db.session.commit()
        return jsonify({"message": "Student deleted successfully"})
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete student: {str(error)}"}), 500
