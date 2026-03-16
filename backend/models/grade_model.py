from bson import ObjectId

from database.db import get_db


def _grades_collection():
    return get_db()["grades"]


def ensure_grade_indexes():
    """Create required indexes for the grades collection."""
    _grades_collection().create_index([("student_id", 1), ("subject", 1)], unique=True)


def _serialize_grade(document):
    if not document:
        return None

    return {
        "id": str(document["_id"]),
        "student_id": document.get("student_id"),
        "subject": document.get("subject"),
        "internal_marks": float(document.get("internal_marks", 0.0)),
        "external_marks": float(document.get("external_marks", 0.0)),
        "assignment_score": float(document.get("assignment_score", 0.0)),
        "total_marks": float(document.get("total_marks", 0.0)),
        "grade": document.get("grade"),
    }


def calculate_grade(total_marks):
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


def get_grades_by_student_id(student_id):
    cursor = _grades_collection().find({"student_id": str(student_id)}).sort("subject", 1)
    return [_serialize_grade(item) for item in cursor]


def get_grade_by_id(grade_id):
    try:
        document = _grades_collection().find_one({"_id": ObjectId(grade_id)})
        return _serialize_grade(document)
    except Exception:
        return None


def create_grade(payload):
    inserted = _grades_collection().insert_one(payload)
    return get_grade_by_id(inserted.inserted_id)


def update_grade(grade_id, payload):
    try:
        _grades_collection().update_one({"_id": ObjectId(grade_id)}, {"$set": payload})
        return get_grade_by_id(grade_id)
    except Exception:
        return None
