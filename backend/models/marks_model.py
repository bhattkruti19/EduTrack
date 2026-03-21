from database.db import get_db


def _marks_collection():
    return get_db()["marks"]


def ensure_marks_indexes():
    """Create indexes for marks queries by student and subject."""
    collection = _marks_collection()
    collection.create_index("student_id")
    collection.create_index("subject")
    collection.create_index("type")


def _serialize_mark(document):
    if not document:
        return None

    return {
        "id": str(document["_id"]),
        "student_id": document.get("student_id"),
        "subject": document.get("subject"),
        "type": document.get("type"),
        "marks": float(document.get("marks", 0.0)),
    }


def create_marks(records):
    if not records:
        return []

    inserted = _marks_collection().insert_many(records)
    cursor = _marks_collection().find({"_id": {"$in": inserted.inserted_ids}})
    return [_serialize_mark(item) for item in cursor]


def get_marks_by_student_id(student_id):
    cursor = _marks_collection().find({"student_id": str(student_id)}).sort("subject", 1)
    return [_serialize_mark(item) for item in cursor]
