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
    except:
        pass
    return "Successfully deleted the encoding"

def get_userids(serverid):
    try:
        user_refs = db.collection(str(serverid)).get()
        userid_list = []
        for userid in user_refs:
            userid_list.append(userid.id)
        return userid_list
    except:
        return []
