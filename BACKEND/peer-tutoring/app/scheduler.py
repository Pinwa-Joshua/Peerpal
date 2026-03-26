from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from .models import Session

scheduler = BackgroundScheduler()

def send_session_reminders(app):
    # Wrap DB access in app context
    with app.app_context():
        upcoming_sessions = Session.query.filter(
            Session.session_date > datetime.utcnow()
        ).all()
        for session in upcoming_sessions:
            print(f"Reminder for session {session.id}")


def start_scheduler(app):
    # Schedule job every 15 minutes
    scheduler.add_job(lambda: send_session_reminders(app), 'interval', minutes=15)
    scheduler.start()
    print("Scheduler started...")