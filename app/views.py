"""app/views.py: the handlers that respond to requests from browsers/other clients.
    - In Flask handlers are written as Python functions.
    - Each view function is mapped to one or more request URLs.

@app.route(path):
    - Create mappings from URL path to the attached function.
    - path is relative to the site/hostname, e.g. '/index' maps to
    --> mysite.com/index

Misc Notes:
    - We can access the config.py variables via app.config dictionary.

"""

from app import app, db
from flask import render_template
from flask import flash, redirect
from flask import session, url_for, request, g
from .forms import BasicForm
from .models import User, Post


@app.route('/')
@app.route('/index')
def index():
    users = User.query.all()
    return render_template('index.html',
                           title='Home',
                           users=users)


@app.route('/input_practice', methods=['GET', 'POST'])
def input_practice():
    basic_form = BasicForm(request.form)
    return render_template('input_practice.html',
                           form=basic_form)


@app.route('/add', methods=['POST'])
def add_user():
    db.session.add(User(nickname=request.form['nickname'],
                        email=request.form['email']))
    db.session.commit()
    flash('New user entry was successfully added to db.')
    return redirect(url_for('input_practice'))


@app.route('/bootstrap_reference')
def bootstrap_reference():
    return render_template('bootstrap_reference.html')
