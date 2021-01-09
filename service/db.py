import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json

def db_connection():
    """Return the firebase object."""
    cred = credentials.Certificate('ServiceAccount.json')
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    return db

db = db_connection()

def add_to_db(userid, serverid, encoding):
    user_ref = db.collection(str(serverid))
    user_ref.document(str(userid)).set({
        "userid":str(userid),
        "serverid":str(serverid),
        "encoding":json.dumps(encoding.tolist())
    })
    return "Successfully updated"


def delete_from_db(userid, serverid):
    try:
        db.collection(str(serverid)).document(str(userid)).delete()
        db.collection(str(serverid))
    except Exception as e:
        print(e)
    return "Successfully deleted the encoding"


# def get_userids(serverid):
#     # return the list of userids
#     return userids
#     # for error return []
#     return []
