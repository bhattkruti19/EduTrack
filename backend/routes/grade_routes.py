from flask import Blueprint, jsonify, request

from models import db
from models.grades import Grade
from models.student import Student

grade_bp = Blueprint("grades", __name__, url_prefix="/api/grades")


def _calculate_grade(total_marks):
    if total_marks >= 85:
        return "A+"
    if total_marks >= 75:
        return "A"
    if total_marks >= 65:
        return "B"
    if total_marks >= 55:
        return "C"
    if total_marks >= 45:
        return "D"
    return "F"


@grade_bp.route("/<int:student_id>", methods=["GET"])
def get_grades_by_student(student_id):
    """API: Get all subject grade records for a student."""
    try:
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"error": "Student not found"}), 404

        grades = Grade.query.filter_by(student_id=student_id).all()
        return jsonify([grade.to_dict() for grade in grades])
    except Exception as error:
        return jsonify({"error": f"Failed to fetch grades: {str(error)}"}), 500


@grade_bp.route("", methods=["POST"])
def create_grade_record():
    """API: Create a subject grade record for a student."""
    try:
        data = request.get_json(silent=True) or {}
        required_fields = ["student_id", "subject", "internal_marks", "external_marks"]
        missing = [field for field in required_fields if field not in data]
        if missing:
            return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

        student = Student.query.get(data.get("student_id"))
        if not student:
            return jsonify({"error": "Student not found"}), 404

        internal_marks = float(data.get("internal_marks", 0))
        external_marks = float(data.get("external_marks", 0))
        total_marks = float(data.get("total_marks", internal_marks + external_marks))
        grade = str(data.get("grade") or _calculate_grade(total_marks)).strip()

        grade_record = Grade(
            student_id=student.id,
            subject=str(data.get("subject", "")).strip(),
            internal_marks=internal_marks,
            external_marks=external_marks,
            total_marks=total_marks,
            grade=grade,
        )

        db.session.add(grade_record)
        db.session.commit()
        return jsonify({"message": "Grade record created", "grade": grade_record.to_dict()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to create grade record: {str(error)}"}), 500


@grade_bp.route("/<int:grade_id>", methods=["PUT"])
def update_grade_record(grade_id):
    """API: Update a grade record by grade id."""
    try:
        grade_record = Grade.query.get(grade_id)
        if not grade_record:
            return jsonify({"error": "Grade record not found"}), 404

        data = request.get_json(silent=True) or {}
        if "subject" in data:
            grade_record.subject = str(data.get("subject", "")).strip()
        if "internal_marks" in data:
            grade_record.internal_marks = float(data.get("internal_marks", 0))
        if "external_marks" in data:
            grade_record.external_marks = float(data.get("external_marks", 0))

        if "total_marks" in data:
            grade_record.total_marks = float(data.get("total_marks", 0))
        else:
            grade_record.total_marks = grade_record.internal_marks + grade_record.external_marks

        grade_record.grade = str(data.get("grade") or _calculate_grade(grade_record.total_marks)).strip()

        db.session.commit()
        return jsonify({"message": "Grade record updated", "grade": grade_record.to_dict()})
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to update grade record: {str(error)}"}), 500
