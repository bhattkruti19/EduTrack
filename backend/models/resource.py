from . import db


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(180), nullable=False)
    author = db.Column(db.String(120), nullable=True)
    link = db.Column(db.String(500), nullable=False)
    category = db.Column(db.String(120), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "author": self.author,
            "link": self.link,
            "category": self.category,
        }
