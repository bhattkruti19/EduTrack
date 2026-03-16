from . import db


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    enrollment_id = db.Column(db.String(80), unique=True, nullable=False)
    branch = db.Column(db.String(120), nullable=False)
    semester = db.Column(db.String(40), nullable=False)
    year = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(180), unique=True, nullable=False)
    attendance_percentage = db.Column(db.Float, default=0.0, nullable=False)
    cgpa = db.Column(db.Float, default=0.0, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "enrollment_id": self.enrollment_id,
            "branch": self.branch,
            "semester": self.semester,
            "year": self.year,
            "email": self.email,
            "attendance_percentage": round(float(self.attendance_percentage or 0.0), 2),
            "cgpa": round(float(self.cgpa or 0.0), 2),
        }
