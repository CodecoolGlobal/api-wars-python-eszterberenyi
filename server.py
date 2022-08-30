from flask import Flask, render_template, request, redirect, url_for, session, flash
from psycopg2.errors import UniqueViolation
from datetime import timedelta
import data_manager, hashing
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
app.secret_key = b'\x1dH@\xb94\xc9\xb0\x8e\xd5\xa8\xfe\\r\x00\x0c\xb4'
app.permanent_session_lifetime = timedelta(minutes=30)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )


