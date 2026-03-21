from bson import ObjectId

from database.db import get_db


def _attendance_collection():
    return get_db()["attendance"]


def ensure_attendance_indexes():
    """Create required indexes for the attendance collection."""
    collection = _attendance_collection()
    collection.create_index("student_id")
    collection.create_index("subject")
    collection.create_index("date")


def _serialize_attendance(document):
    if not document:
        return None

    return {
        "id": str(document["_id"]),
        "student_id": document.get("student_id"),
        "subject": document.get("subject"),
        "attended_classes": int(document.get("attended_classes", 0)),
        "total_classes": int(document.get("total_classes", 0)),
        "attendance_percentage": float(document.get("attendance_percentage", 0.0)),
    }


def calculate_attendance_percentage(attended_classes, total_classes):
    if total_classes <= 0:
        return 0.0
    return round((attended_classes / total_classes) * 100, 2)


def get_attendance_by_student_id(student_id):
    cursor = _attendance_collection().find({"student_id": str(student_id)}).sort("subject", 1)
    return [_serialize_attendance(item) for item in cursor]


def get_attendance_by_id(attendance_id):
    try:
        document = _attendance_collection().find_one({"_id": ObjectId(attendance_id)})
        return _serialize_attendance(document)
    except Exception:
        return None


def create_attendance(payload):
    inserted = _attendance_collection().insert_one(payload)
    return get_attendance_by_id(inserted.inserted_id)


def update_attendance(attendance_id, payload):
    try:
        _attendance_collection().update_one({"_id": ObjectId(attendance_id)}, {"$set": payload})
        return get_attendance_by_id(attendance_id)
    except Exception:
        return None


def _serialize_attendance_entry(document):
    if not document:
        return None

    return {
        "id": str(document["_id"]),
        "student_id": document.get("student_id"),
        "subject": document.get("subject"),
        "date": document.get("date"),
        "status": document.get("status"),
    }


def create_attendance_entries(records):
    if not records:
        return []

    inserted = _attendance_collection().insert_many(records)
    cursor = _attendance_collection().find({"_id": {"$in": inserted.inserted_ids}})
    return [_serialize_attendance_entry(item) for item in cursor]


def get_attendance_entries_by_student(student_id):
    cursor = _attendance_collection().find({"student_id": str(student_id)}).sort("date", -1)
    return [_serialize_attendance_entry(item) for item in cursor]
