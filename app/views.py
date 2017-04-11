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

from app import app, lm, db, oid
from flask import render_template
from flask import flash, redirect
from flask import session, url_for, request, g
from flask_login import login_user, logout_user
from flask_login import current_user, login_required
from .forms import LoginForm
from .models import User


@app.route('/')
@app.route('/index')
#@login_required
def index():
    user = g.user
    posts = [
        {'author': {'nickname': 'Brandon'},
         'body': 'I am dead inside! Woo!'},
        {'author': {'nickname': 'George'},
         'body': 'Putin is innocent! He is great man.'}
    ]
    return render_template('index.html',
                           title='Home',
                           user=user,
                           posts=posts)


@app.before_request
def before_request():
    """Any fns decorated with before_request will run before the view fn each
    time a request is received.
    """
    # current_user is a global set by Flask-Login.
    # We just put a copy in the g object to have better access to it.
    g.user = current_user


# Defining methods=['GET', 'POST'] tells flask that this
# view function accepts bost GET and POST requests.
# Default is just GET.
@app.route('/login', methods=['GET', 'POST'])
@oid.loginhandler
def login():
    # 'g' is a global setup by Flask for storing/sharing data during requests.
    if g.user is not None and g.user.is_authenticated:
        # url_for('name') returns the url associated with a fn 'name' in views.py.
        return redirect(url_for('index'))
    # Instantiate our LoginForm.
    form = LoginForm()
    if True:
        return redirect(url_for('index'))

    # If form has been validated (i.e. user has entered info & clicked submit).
    if form.validate_on_submit():
        # Store value of boolean in the flask session. (NOT the db.session)
        # The flask session data is available during the request and any future
        # requests made by the same client.
        session['remember_me'] = form.remember_me.data
        # Trigger the user auth through Flask-OpenID.
        # If successful, Flask-OpenID calls fn decorated with @oid.after_login.
        return oid.try_login(form.openid.data, ask_for=['nickname', 'email'])
    return render_template('login.html',
                           title='Sign In',
                           form=form,
                           providers=app.config['OPENID_PROVIDERS'])


@oid.after_login
def after_login(resp):
    if resp.email is None or resp.email == "":
        flash("Invalid login. What are you doing with your life.")
        return redirect(url_for('login'))
    user = User.query.filter_by(email=resp.email).first()
    if user is None:
        nickname = resp.nickname
        if nickname is None or nickname == "":
            nickname = resp.email.split('@')[0]
        user = User(nickname=nickname, email=resp.email)
        db.session.add(user)
        db.session.commit()
    remember_me = False
    if 'remember_me' in session:
        remember_me = session['remember_me']
        session.pop('remember_me', None)
    login_user(user, remember_me=remember_me)
    return redirect(request.args.get('next') or url_for('index'))


@lm.user_loader
def load_user(id):
    """Load a user from the db. Used by Flask-Login."""
    return User.query.get(int(id))
