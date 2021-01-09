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
        "status":"healthy",
        "timestamp": int(time.time()*1000.0)
    })

@app.route("/add", methods=['POST'])
def add_or_update():
    print(request.json)
    return "add"

@app.route("/delete", methods=['DELETE'])
def delete():
    return "delete"

@app.route("/detect", methods=['POST'])
def detect_face():
    return "detect"

if __name__ == "__main__":
    app.run()