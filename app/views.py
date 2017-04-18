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
from .forms import BasicForm
from .models import User, Post


@app.route('/')
@app.route('/index')
def index():
    # Load all User objects from db database.
    users = User.query.all()
    return render_template('index.html',
                           title='Home',
                           users=users)


@app.route('/bootstrap_reference')
def bootstrap_reference():
    return render_template('bootstrap_reference.html')


@app.route('/jquery_reference')
def jquery_reference():
    return render_template('jquery_reference.html')


@app.route('/flask_reference')
def flask_reference():
    return render_template('flask_reference.html')


@app.route('/eloquent_javascript')
def eloquent_javascript():
    return render_template('eloquent_javascript.html')


@app.route('/input_practice', methods=['GET', 'POST'])
def input_practice():

    # Create the form(s) used for this endpoint.
    flask_form = BasicForm(prefix="flask_form")
    if flask_form.validate_on_submit() and flask_form.submit.data:
        flash('flask_form validated. Message: {}'.format(
            flask_form.message.data))
    return render_template('input_practice.html',
                           flask_form=flask_form)


@app.route('/add_user', methods=['POST'])
def add_user():

    # Get or create the user.
    u = User.query.filter_by(nickname=request.form['nickname']).first()
    if u is None:
        u = User(nickname=request.form['nickname'])

    # Associate user and their post.
    p = Post(body=request.form['post-body'],
             timestamp=datetime.utcnow(),
             author=u)

    # Add and commit to database.
    db.session.add(u)
    db.session.add(p)
    db.session.commit()

    # Route back to the html page.
    flash('New user entry was successfully added to db.')
    return redirect(url_for('input_practice'))


@app.route('/delete/<post_id>', methods=['POST'])
def delete_post(post_id):
    db.session.delete(Post.query.get_or_404(post_id))
    db.session.commit()
    return redirect(url_for('index'))

