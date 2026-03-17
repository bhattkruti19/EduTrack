from bson import ObjectId
from bson.errors import InvalidId

from database.db import get_db


def _students_collection():
    return get_db()["students"]


def ensure_student_indexes():
    """Create required indexes for the students collection."""
    collection = _students_collection()
    collection.create_index("student_id", unique=True)
    collection.create_index("enrollment_id", unique=True)
    collection.create_index("email", unique=True)
    collection.create_index("counsellor_name")


def _serialize_student(document):
    if not document:
        return None

    return {
        "id": str(document["_id"]),
        "student_id": document.get("student_id"),
        "name": document.get("name"),
        "batch": document.get("batch"),
        "counsellor_name": document.get("counsellor_name"),
        "enrollment_id": document.get("enrollment_id"),
        "branch": document.get("branch"),
        "year": document.get("year"),
        "semester": document.get("semester"),
        "email": document.get("email"),
        "cgpa": float(document.get("cgpa", 0.0)),
        "attendance_percentage": float(document.get("attendance_percentage", 0.0)),
    }


def get_all_students():
    cursor = _students_collection().find().sort("student_id", 1)
    return [_serialize_student(item) for item in cursor]


def get_student_by_id(student_object_id):
    try:
        document = _students_collection().find_one({"_id": ObjectId(student_object_id)})
        return _serialize_student(document)
    except Exception:
        return None


def _get_student_document_by_identifier(identifier):
    if identifier is None:
        return None

    identifier_str = str(identifier).strip()
    if not identifier_str:
        return None

    queries = [{"student_id": identifier_str}]
    try:
        queries.insert(0, {"_id": ObjectId(identifier_str)})
    except (InvalidId, TypeError, ValueError):
        pass

    if len(queries) == 1:
        return _students_collection().find_one(queries[0])
    return _students_collection().find_one({"$or": queries})


def get_student_by_student_id(student_id):
    document = _students_collection().find_one({"student_id": str(student_id)})
    return _serialize_student(document)


def get_student_by_identifier(identifier):
    return _serialize_student(_get_student_document_by_identifier(identifier))


def get_students_by_counsellor(counsellor_name):
    cursor = _students_collection().find({"counsellor_name": counsellor_name}).sort("student_id", 1)
    return [_serialize_student(item) for item in cursor]


def create_student(payload):
    inserted = _students_collection().insert_one(payload)
    return get_student_by_id(inserted.inserted_id)


def update_student(student_object_id, payload):
    try:
        document = _get_student_document_by_identifier(student_object_id)
        if not document:
            return None
        _students_collection().update_one({"_id": document["_id"]}, {"$set": payload})
        return get_student_by_id(document["_id"])
    except Exception:
        return None


def delete_student(student_object_id):
    try:
        document = _get_student_document_by_identifier(student_object_id)
        if not document:
            return False
        result = _students_collection().delete_one({"_id": document["_id"]})
        return result.deleted_count > 0
    except Exception:
        return False
