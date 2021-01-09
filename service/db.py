import json
from firebase_admin import credentials, firestore, initialize_app

def db_connection():
    """Return the firebase object."""
    cred = credentials.Certificate('serviceAccount.json')
    initialize_app(cred)
    db = firestore.client()
    return db

db = db_connection()

def add_to_db(userid, serverid, encoding):
    user_ref = db.collection(str(serverid))
    user_ref.document(str(userid)).set({
        "userid" : str(userid),
        "serverid" : str(serverid),
        "encoding" : json.dumps(encoding.tolist())
    })
    return "Successfully updated"


def delete_from_db(userid, serverid):
    try:
        db.collection(str(serverid)).document(str(userid)).delete()
        db.collection(str(serverid))
    except Exception as e:
        print(e)
    return "Successfully deleted the encoding"


def get_userids(serverid):
    try:
        user_list = db.collection(str(serverid)).get()
        for user in user_list:
            print(user.data())
        print(user_list)
        return user_list
    except Exception as e:
        print(e)
        return []
