from flask import Blueprint, jsonify, request

from models import db
from models.resource import Resource

resource_bp = Blueprint("resources", __name__, url_prefix="/api/resources")


@resource_bp.route("", methods=["GET"])
def get_resources():
    """API: Get all academic resources."""
    try:
        resources = Resource.query.order_by(Resource.id.desc()).all()
        return jsonify([resource.to_dict() for resource in resources])
    except Exception as error:
        return jsonify({"error": f"Failed to fetch resources: {str(error)}"}), 500


@resource_bp.route("", methods=["POST"])
def create_resource():
    """API: Create a new academic resource."""
    try:
        data = request.get_json(silent=True) or {}
        title = str(data.get("title", "")).strip()
        link = str(data.get("link", "")).strip()
        author = str(data.get("author", "")).strip() or None
        category = str(data.get("category", "")).strip() or None

        if not title or not link:
            return jsonify({"error": "title and link are required"}), 400

        resource = Resource(
            title=title,
            author=author,
            link=link,
            category=category,
        )
        db.session.add(resource)
        db.session.commit()

        return jsonify({"message": "Resource created", "resource": resource.to_dict()}), 201
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to create resource: {str(error)}"}), 500
