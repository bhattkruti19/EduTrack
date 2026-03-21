from database.db import get_db


def _students_collection():
    return get_db()["students"]


def _attendance_collection():
    return get_db()["attendance"]


def _marks_collection():
    return get_db()["marks"]


def _attendance_percentage(student_id):
    total = _attendance_collection().count_documents({"student_id": student_id})
    if total == 0:
        return 100.0

    present = _attendance_collection().count_documents(
        {
            "student_id": student_id,
            "status": {"$regex": "^present$", "$options": "i"},
        }
    )
    return round((present / total) * 100, 2)


def _average_marks(student_id):
    aggregate = _marks_collection().aggregate(
        [
            {"$match": {"student_id": student_id}},
            {"$group": {"_id": None, "avg_marks": {"$avg": "$marks"}}},
        ]
    )
    return round(float((next(aggregate, {}) or {}).get("avg_marks", 100.0) or 100.0), 2)


def _evaluate_risk(attendance_percentage, average_marks):
    if attendance_percentage < 60:
        return "High", "Low attendance"
    if average_marks < 50:
        return "Medium", "Low marks"
    return "Low", "Good attendance and marks"


def get_risk_predictions():
    students = _students_collection().find({}, {"student_id": 1, "name": 1}).sort("student_id", 1)

    predictions = []
    for student in students:
        student_id = str(student.get("student_id", "")).strip()
        if not student_id:
            continue

        attendance_percentage = _attendance_percentage(student_id)
        average_marks = _average_marks(student_id)
        status, reason = _evaluate_risk(attendance_percentage, average_marks)

        predictions.append(
            {
                "student_id": student_id,
                "name": student.get("name", "Unknown"),
                "status": status,
                "reason": reason,
                "attendance_percentage": attendance_percentage,
                "average_marks": average_marks,
            }
        )

    return predictions


def get_dashboard_risk_counts():
    predictions = get_risk_predictions()
    low_risk = sum(1 for item in predictions if item.get("status") == "Low")
    medium_risk = sum(1 for item in predictions if item.get("status") == "Medium")
    high_risk = sum(1 for item in predictions if item.get("status") == "High")

    return {
        "total_students": len(predictions),
        "low_risk": low_risk,
        "medium_risk": medium_risk,
        "high_risk": high_risk,
    }
