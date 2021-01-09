import base64
import re
from PIL import Image
from io import BytesIO
import numpy as np
import face_recognition
import db

def get_image_from_b64(img_b64, mode="RGB"):
    try:
        img_b64 = re.sub('^data:image/.+;base64,', '', img_b64)
        img = Image.open(BytesIO(base64.b64decode(img_b64)))
        img = img.convert(mode)
        return np.array(img)
    except:
        return None

def get_encoding(img):
    try:
        encodings = face_recognition.face_encodings(img)
        return encodings
    except:
        return []

def save_encoding(userid, serverid, encoding):
    # save or update encoding
    return

def get_ids_from_img(serverid, encodings):
    userids = db.get_userids(serverid)
    if userids == []:
        return ValueError("No member in the server")
    for encoding in encodings:
        detected_ids = ["id1","id2"]
    return detected_ids
