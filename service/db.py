import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def db_connection():
    """Return the firebase object."""
    cred = credentials.Certificate('serviceAccount.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db
