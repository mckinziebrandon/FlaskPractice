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
from datetime import datetime
from .forms import BasicForm, UserForm
from .models import User, Post

HTTP_CODES = {
    'REDIRECT': 307
}


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
    # Load all User objects from db database.
    users = User.query.all()
    forms = {'user_form': UserForm()}
    form = forms['user_form']
    if form.validate_on_submit() and form.submit.data:
        flash('user_form valid')
        session['nickname'] = forms['user_form'].nickname.data
        return redirect(url_for('add_user'), code=HTTP_CODES['REDIRECT'])
    return render_template('index.html',
                           title='Home',
                           users=users,
                           forms=forms)


@app.route('/databases', methods=['GET', 'POST'])
def databases():
    # Load all User objects from db database.
    users = User.query.all()
    forms = {'user_form': UserForm()}
    form = forms['user_form']
    if form.validate_on_submit() and form.submit.data:
        flash('user_form valid')
        session['nickname'] = forms['user_form'].nickname.data
        return redirect(url_for('add_user'), code=HTTP_CODES['REDIRECT'])
    return render_template('databases.html',
                           users=users,
                           forms=forms)


@app.route('/input_practice', methods=['GET', 'POST'])
def input_practice():
    # Create the form(s) used for this endpoint.
    forms = {'basic_form': BasicForm(),
             'user_form': UserForm()}

    form = forms['basic_form']
    if form.validate_on_submit() and form.submit.data:
        flash('basic_form validated. Message: {}'.format(
            forms['basic_form'].message.data))
        return redirect(url_for('input_practice'))

    form = forms['user_form']
    if form.validate_on_submit() and form.submit.data:
        flash('user_form valid')
        session['nickname'] = forms['user_form'].nickname.data
        return redirect(url_for('add_user'), code=HTTP_CODES['REDIRECT'])
    return render_template('input_practice.html', forms=forms)


@app.route('/add_user', methods=['POST'])
def add_user():
    # This will get filled with form info via request.
    user_form = UserForm(nickname=session.get('nickname'))
    if not user_form:
        flash("Couldn't find user_form in Session. Creating a new one.")
        user_form = UserForm()

    if user_form.validate_on_submit():

        # Get or create the user.
        user = User.query.filter_by(nickname=user_form.nickname.data).first()
        if user is None:
            user = User(nickname=user_form.nickname.data)

        # Associate user and their post.
        post = Post(body=user_form.post.data,
                    timestamp=datetime.utcnow(),
                    author=user)

        # Add and commit to database.
        db.session.add_all([user, post])
        db.session.commit()
        flash('Database successfully updated.')
    else:
        flash('Error: form submission not validated.')
        flash(user_form.errors)

    # Go back to where ya came from!
    return redirect(request.referrer)


@app.route('/delete_post/<id>', methods=['POST'])
def delete_post(id):
    # TODO: make this via ajax so full page doesn't need to re-render.
    post = Post.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return redirect(request.referrer)


@app.route('/delete_user/<id>', methods=['POST'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return redirect(request.referrer)


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


@app.route('/reference/<prefix>')
def reference(prefix):
    return render_template('reference/{}_reference.html'.format(prefix))

@app.route('/games')
def games():
    return render_template('games.html')

