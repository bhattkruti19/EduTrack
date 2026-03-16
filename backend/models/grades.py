from . import db


class Grade(db.Model):
    __tablename__ = "grades"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("students.id"), nullable=False)
    subject = db.Column(db.String(120), nullable=False)
    internal_marks = db.Column(db.Float, nullable=False, default=0.0)
    external_marks = db.Column(db.Float, nullable=False, default=0.0)
    total_marks = db.Column(db.Float, nullable=False, default=0.0)
    grade = db.Column(db.String(10), nullable=False, default="F")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "subject": self.subject,
            "internal_marks": round(float(self.internal_marks or 0.0), 2),
            "external_marks": round(float(self.external_marks or 0.0), 2),
            "total_marks": round(float(self.total_marks or 0.0), 2),
            "grade": self.grade,
        }
