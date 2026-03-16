from datetime import datetime

from flask import Blueprint, jsonify, request

from models import db
from models.calendar_event import CalendarEvent

calendar_bp = Blueprint("calendar", __name__, url_prefix="/api/calendar")


@calendar_bp.route("", methods=["GET"])
def get_calendar_events():
    """API: Get all academic calendar events."""
    try:
        events = CalendarEvent.query.order_by(CalendarEvent.event_date.asc()).all()
        return jsonify([event.to_dict() for event in events])
    except Exception as error:
        return jsonify({"error": f"Failed to fetch calendar events: {str(error)}"}), 500


@calendar_bp.route("", methods=["POST"])
def create_calendar_event():
    """API: Create a new academic calendar event."""
    try:
        data = request.get_json(silent=True) or {}
        event_title = str(data.get("event_title", "")).strip()
        event_date_str = str(data.get("event_date", "")).strip()
        description = data.get("description")

        if not event_title or not event_date_str:
            return jsonify({"error": "event_title and event_date are required"}), 400

        event_date = datetime.fromisoformat(event_date_str).date()

        event = CalendarEvent(
            event_title=event_title,
            event_date=event_date,
            description=description,
        )
        db.session.add(event)
        db.session.commit()

        return jsonify({"message": "Calendar event created", "event": event.to_dict()}), 201
    except ValueError:
        return jsonify({"error": "event_date must be in ISO format YYYY-MM-DD"}), 400
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to create calendar event: {str(error)}"}), 500


@calendar_bp.route("/<int:event_id>", methods=["DELETE"])
def delete_calendar_event(event_id):
    """API: Delete an academic calendar event by id."""
    try:
        event = CalendarEvent.query.get(event_id)
        if not event:
            return jsonify({"error": "Calendar event not found"}), 404

        db.session.delete(event)
        db.session.commit()
        return jsonify({"message": "Calendar event deleted successfully"})
    except Exception as error:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete calendar event: {str(error)}"}), 500
