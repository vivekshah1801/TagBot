import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def firebase_database():
    """Return the firebase object."""
    cred = credentials.Certificate('credential.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db
