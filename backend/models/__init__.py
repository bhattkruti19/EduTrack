from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .attendance import Attendance  # noqa: E402,F401
from .calendar_event import CalendarEvent  # noqa: E402,F401
from .grades import Grade  # noqa: E402,F401
from .resource import Resource  # noqa: E402,F401
from .student import Student  # noqa: E402,F401
from .user import User  # noqa: E402,F401
