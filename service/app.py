import time
from flask import Flask, abort, jsonify, request
from flask_cors import CORS

import recognition as reco
import db
import utilities

app = Flask(__name__)
CORS(app)
@app.route("/status")
def health():
    return jsonify({
        "status" : "healthy",
        "timestamp": int(time.time()*1000.0)
    })

@app.route("/add", methods=['POST'])
def add_or_update():
    try:
        userid, serverid, img_b64 = request.json["userid"], request.json["serverid"], request.json["image"]
        img = reco.get_image_from_b64(img_b64)
        if img is None:
            return jsonify({
                "status" : "fail",
                "message" : "Error in parsing the image from request."
            })
        encodings = reco.get_encoding(img)
        if len(encodings)!=1:
            return jsonify({
                "status" : "fail",
                "message": "Zero or more than one face found in image."
            })
        encoding = encodings[0]
        msg = db.add_to_db(userid, serverid, encoding)
        msg = "Success"
        reco.save_encoding(userid, serverid, encoding)
        return jsonify({
            "status" : "success",
            "userid" : userid,
            "serverid" : serverid,
            "message" : msg
        })
    except:
        return jsonify({
            "status" : "fail",
            "message" : "Error in saving image encoding."
        })

@app.route("/delete", methods=['DELETE'])
def delete():
    userid, serverid = request.json["userid"], request.json["serverid"]
    try:
        msg = db.delete_from_db(userid,serverid)
        msg = "success"
        reco.delete_encoding(userid, serverid)
        return jsonify({
            "status" : "success",
            "userid" : userid,
            "serverid" : serverid,
            "message" : msg
        })
    except:
        return jsonify({
            "status" : "fail",
            "message" : "Error in deletion."
        })
        
@app.route("/get_user",methods=["POST"])
def get_user():
    serverid = request.json["serverid"]
    userid_list = db.get_userids(serverid)
    print(userid_list)
    if len(userid_list) != 0:
        return jsonify({
                "status" : "Success"
            })
    else:
        return jsonify({
                "status" : "fail",
                "message" : "Server is not present"
            })

@app.route("/detect", methods=['POST'])
def detect_face():
    try:
        userid, serverid, img_b64 = request.json["userid"], request.json["serverid"], request.json["image"]
        img = reco.get_image_from_b64(img_b64)
        if img is None:
            return jsonify({
                "status" : "fail",
                "message" : "Error in parsing the image from request."
            })
        encodings = reco.get_encoding(img)
        res = reco.get_ids_from_img(serverid, encodings)
        return jsonify({
            "status" : "success",
            "userid" : userid,
            "serverid" : serverid,
            "detected_id" : res # list of userids. assured that they are from the server
        })
    except:
        return jsonify({
            "status" : "fail",
            "message" : "Error in detecting faces."
        })

@app.route("/check_mapping", methods=['GET'])
def check_mapping():
    l = {}
    for server in reco.mapping:
        l[server] = list(reco.mapping[server].keys()) # list of userids in the server
    return jsonify(l)

if __name__ == "__main__":
    app.run()