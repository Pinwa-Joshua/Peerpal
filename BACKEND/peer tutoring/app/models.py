from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from .database import db

user_subject = db.Table(
    "user_subject",
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
    db.Column("subject_id", db.Integer, db.ForeignKey("subjects.id"), primary_key=True)
)

# USER 
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(512), nullable=False)
    role = db.Column(db.String(20), default="student") 
    banned_until = db.Column(db.DateTime, nullable = True)
    learner_style = db.Column(db.String(50))
    profile_picture = db.Column(db.String(255), nullable=True)
    university_id = db.Column(db.Integer, db.ForeignKey("universities.id"), nullable=True)  
    university = db.relationship("University", backref="users")
    # Association table for many-to-many relationship


    # Global rating (aggregated from feedback)
    average_rating = db.Column(db.Float, default=0.0)
    rating_count = db.Column(db.Integer, default=0)

    # Relationships
    tutor_profile = db.relationship("Tutor", backref="user", uselist=False)
    sent_feedbacks = db.relationship('Feedback', foreign_keys='Feedback.from_user_id', backref='from_user')
    received_feedbacks = db.relationship('Feedback', foreign_keys='Feedback.to_user_id', backref='to_user')
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', backref='sender')
    received_messages = db.relationship('Message', foreign_keys='Message.receiver_id', backref='receiver')
    subjects = db.relationship(
    'Subject',
    secondary=user_subject,  
    back_populates='users'
)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def update_rating(user, new_rating):
        total = user.average_rating * user.rating_count
        total += new_rating
        user.rating_count += 1
        user.average_rating = total / user.rating_count


#  TUTOR PROFILE 
class Tutor(db.Model):
    __tablename__ = "tutor_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, unique=True)
    experience_level = db.Column(db.String(50))
    availability = db.Column(db.String(255))
    active = db.Column(db.Boolean, default=True)
    verified = db.Column(db.Boolean, default=False)
    tutor_style = db.Column(db.String(50))


# MATCH (3-MONTH PAIRING) 
class Match(db.Model):
    __tablename__ = "matches"

    id = db.Column(db.Integer, primary_key=True)
    tutor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tutee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"))
    
    start_date = db.Column(db.DateTime, default=datetime.utcnow)
    end_date = db.Column(db.DateTime)
    active = db.Column(db.Boolean, default=True)
    
    subject = db.relationship("Subject")
    sessions = db.relationship("Session", backref="match", lazy=True)
    tutor=db.relationship("User", foreign_keys= [tutor_id])
    tutee= db.relationship("User", foreign_keys=[tutee_id])
    progress_entries = db.relationship('Progress', backref="match", lazy=True)
   

#SUBJECTS
class Subject(db.Model):
    __tablename__ = "subjects"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False, unique=True)
    users = db.relationship(
    'User',
    secondary=user_subject,  # <--- same table
    back_populates='subjects'
)
   
# SESSION 
class Session(db.Model):
    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)

    match_id = db.Column(db.Integer, db.ForeignKey("matches.id"), nullable=False)

    tutor_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    tutee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)  
    subject_id = db.Column(db.Integer, db.ForeignKey("subjects.id"))       
    session_date = db.Column(db.DateTime)
    duration = db.Column(db.Integer)
 
    status = db.Column(db.String(20), default="pending")
    # pending / accepted / rejected / completed

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    progress_entries = db.relationship("Progress", backref="session", lazy=True)
    subject = db.relationship("Subject")


#  FEEDBACK 
class Feedback(db.Model):
    __tablename__ = "feedbacks"

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    to_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey("sessions.id"))
    rating = db.Column(db.Float, nullable=False)
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("from_user_id", "session_id", name="unique_feedback_per_session"),
    )


#  MESSAGE 
class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


#  PROGRESS MONITOR
class Progress(db.Model):
    __tablename__ = "progress"

    id = db.Column(db.Integer, primary_key=True)

    match_id = db.Column(db.Integer, db.ForeignKey("matches.id"), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey("sessions.id"), nullable=False)

    topic = db.Column(db.String(255), nullable=False)

    pre_score = db.Column(db.Integer, nullable=False)   # before session (1-5)
    post_score = db.Column(db.Integer, nullable=False)  # after session (1-5)

    improvement = db.Column(db.Integer)  # calculated automatically

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    study_hours = db.Column(db.Float)

    notes = db.Column(db.Text)



    def calculate_improvement(self):
        self.improvement = self.post_score - self.pre_score
# REVOKED TOKEN 
class RevokedToken(db.Model):
    __tablename__ = "revoked_tokens"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), nullable=False, unique=True)

class Notification(db.Model):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    message = db.Column(db.String(255))
    is_read = db.Column(db.Boolean, default=False)


from .database import db

class University(db.Model):
    __tablename__ = "universities"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    country = db.Column(db.String(100), nullable=True)