from flask import Blueprint, jsonify
from sqlalchemy import case, func

from models import db
from models.grades import Grade
from models.student import Student

analytics_bp = Blueprint("analytics", __name__, url_prefix="/api/analytics")


@analytics_bp.route("/dashboard", methods=["GET"])
def dashboard_analytics():
    """API: Get dashboard summary analytics for total students, average CGPA and at-risk data."""
    try:
        total_students = Student.query.count()

        avg_cgpa_raw = db.session.query(func.avg(Student.cgpa)).scalar()
        average_cgpa = round(float(avg_cgpa_raw or 0.0), 2)

        at_risk_students = Student.query.filter(
            (Student.cgpa < 6.0) | (Student.attendance_percentage < 75.0)
        ).count()

        lowest_subject = (
            db.session.query(Grade.subject, func.avg(Grade.total_marks).label("avg_marks"))
            .group_by(Grade.subject)
            .order_by(func.avg(Grade.total_marks).asc())
            .first()
        )

        lowest_subject_payload = None
        if lowest_subject:
            lowest_subject_payload = {
                "subject": lowest_subject.subject,
                "average_marks": round(float(lowest_subject.avg_marks or 0.0), 2),
            }

        return jsonify(
            {
                "total_students": total_students,
                "average_cgpa": average_cgpa,
                "at_risk_students": at_risk_students,
                "subject_with_lowest_performance": lowest_subject_payload,
            }
        )
    except Exception as error:
        return jsonify({"error": f"Failed to fetch dashboard analytics: {str(error)}"}), 500


@analytics_bp.route("/subject-risk", methods=["GET"])
def subject_risk_analytics():
    """API: Get subject-wise risk analytics including average marks and low-score counts."""
    try:
        subject_data = (
            db.session.query(
                Grade.subject.label("subject"),
                func.avg(Grade.total_marks).label("average_marks"),
                func.sum(case((Grade.total_marks < 50, 1), else_=0)).label("at_risk_count"),
            )
            .group_by(Grade.subject)
            .all()
        )

        result = [
            {
                "subject": row.subject,
                "average_marks": round(float(row.average_marks or 0.0), 2),
                "at_risk_count": int(row.at_risk_count or 0),
            }
            for row in subject_data
        ]

        return jsonify(result)
    except Exception as error:
        return jsonify({"error": f"Failed to fetch subject risk analytics: {str(error)}"}), 500
