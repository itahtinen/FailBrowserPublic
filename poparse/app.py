from flask import Flask, render_template, request
import requests
import subprocess
from werkzeug.utils import secure_filename
import os, os.path
from poparse import get_file

app = Flask(__name__)
UPLOAD_FOLDER = "/data"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.isdir("/data"): os.mkdir("/data")

@app.route("/")
def index():

    return render_template("app.html")


@app.route("/feedxml", methods=["POST"])
def feed_xml():
    if request.method == "POST":

        f = request.files["file"]

        f.save(os.path.join(app.config["UPLOAD_FOLDER"], secure_filename(f.filename)))

        get_file(os.path.join(app.config["UPLOAD_FOLDER"], secure_filename(f.filename)))
        return render_template("success.html", name=f.filename)
