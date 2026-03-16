from datetime import datetime, timezone

from bson import ObjectId

from database.db import get_db


def _users_collection():
    return get_db()["users"]


def ensure_user_indexes():
    """Create required indexes for the users collection."""
    _users_collection().create_index("email", unique=True)


def _serialize_user(document):
    if not document:
        return None

    return {
        "id": str(document["_id"]),
        "name": document.get("name"),
        "email": document.get("email"),
        "role": document.get("role"),
        "created_at": document.get("created_at"),
    }


def find_user_by_email(email):
    return _users_collection().find_one({"email": email})


def find_user_document_by_id(user_id):
    try:
        return _users_collection().find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None


def find_user_by_id(user_id):
    return _serialize_user(find_user_document_by_id(user_id))


def create_user(name, email, password_hash, role):
    payload = {
        "name": name,
        "email": email,
        "password": password_hash,
        "role": role,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    inserted = _users_collection().insert_one(payload)
    return find_user_by_id(inserted.inserted_id)
