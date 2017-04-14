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
from flask_login import login_user, logout_user
from flask_login import current_user, login_required
from .forms import LoginForm
from .models import User


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html',
                           title='Home',
                           user={'nickname': 'fuck you'})

