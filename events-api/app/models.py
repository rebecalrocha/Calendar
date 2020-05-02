from datetime import datetime
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password = db.Column(db.String(128))
    events = db.relationship('Event', backref='owner', lazy='dynamic')

    def __repr__(self):
        return '<User {}>'.format(self.email)    

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(140))
    start_time = db.Column(db.DateTime, index=True)
    end_time = db.Column(db.DateTime, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Event {}>'.format(self.description)

    def serialize(self):
        return {
            "description": self.description,
            "start_time": self.start_time.strftime("%Y-%m-%dT%H:%M:%S"),
            "end_time": self.end_time.strftime("%Y-%m-%dT%H:%M:%S"),
            "id": self.id
        }

        