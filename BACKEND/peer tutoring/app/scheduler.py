from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime, timedelta
from app.models import Session, Notification
from app.database import db

def send_session_reminders():
    # Get current time
    now = datetime.utcnow()
    # Look for sessions starting in the next 1 hour
    upcoming_sessions = Session.query.filter(
        Session.session_date >= now,
        Session.session_date <= now + timedelta(hours=1),
        Session.status == "accepted"  # Only accepted sessions
    ).all()

    for session in upcoming_sessions:
        # Notify tutor
        notif_tutor = Notification(
            user_id=session.tutor_id,
            message=f"Reminder: You have a session with {session.tutee.username} at {session.session_date}"
        )
        # Notify tutee
        notif_tutee = Notification(
            user_id=session.tutee_id,
            message=f"Reminder: You have a session with {session.tutor.username} at {session.session_date}"
        )
        db.session.add(notif_tutor)
        db.session.add(notif_tutee)

    db.session.commit()

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Run every 15 minutes
    scheduler.add_job(send_session_reminders, 'interval', minutes=15)
    scheduler.start()