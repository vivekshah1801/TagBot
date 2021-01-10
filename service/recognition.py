import base64
import re
from PIL import Image
from io import BytesIO
import numpy as np
import face_recognition
import db

mapping = {}

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
        encodings = face_recognition.face_encodings(img) # try for better model
        return encodings
    except:
        return []

def save_encoding(userid, serverid, encoding):
    if str(serverid) not in mapping:
        mapping[str(serverid)] = {}
    mapping[str(serverid)][str(userid)] = encoding
    return

def delete_encoding(userid, serverid):
    try:
        del mapping[str(serverid)][str(userid)]
        if (str(serverid) in mapping) and (len(mapping[str(serverid)])==0):
            del mapping[str(serverid)]
        return
    except:
        return

def get_ids_from_img(serverid, unknown_encodings):
    # userids = db.get_userids(serverid)
    if str(serverid) not in mapping:
        return []
    server_encodings = mapping[str(serverid)]
    if len(server_encodings) == 0:
        return []
    detected_ids = []
    for unknown_encoding in unknown_encodings:
        detected_id = _detect_id_from_single_encoding(server_encodings, unknown_encoding, threshold=0.57)
        if detected_id:
            detected_ids.append(detected_id)
    return detected_ids

def _detect_id_from_single_encoding(server_encodings, unknown_encoding, threshold=0.57):
    known_encoding_list = list(server_encodings.values())
    distances = face_recognition.face_distance(known_encoding_list, unknown_encoding)
    # filtering by thresholding on distance
    distance_name = {u:d for u,d in zip(server_encodings.keys(), distances) if d<threshold}
    # returning the username with max match
    detected_id = min(distance_name, key=distance_name.get, default=None)
    return detected_id
