from . import db


class CalendarEvent(db.Model):
    __tablename__ = "calendar_events"

    id = db.Column(db.Integer, primary_key=True)
    event_title = db.Column(db.String(180), nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "event_title": self.event_title,
            "event_date": self.event_date.isoformat(),
            "description": self.description,
        }
