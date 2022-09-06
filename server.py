from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
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


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        hashed_password = hashing.hash_password(request.form.get('password-register'))
        try:
            data_manager.add_user(request.form.get('username-register'), hashed_password)
            # session['username'] = request.form.get('username-register')
            return redirect(url_for('login'))
        except UniqueViolation:
            response = 'unsuccessful'
            return redirect(url_for('register', attempt=response))
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_data = data_manager.get_user(request.form.get('username-login'))
        if user_data is not None and hashing.verify_password(request.form.get('password-login'), user_data.get('password')):
            session['username'] = request.form.get('username-login')
            return redirect(url_for('index'))
        return redirect(url_for('login', attempt='unsuccessful'))
    return render_template('login.html')


@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))


if __name__ == "__main__":
    app.run(
        debug=True,
        port=5000
    )


