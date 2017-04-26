"""app/main/views.py: the handlers that respond to requests from browsers/other clients.
    - In Flask handlers are written as Python functions.
    - Each view function is mapped to one or more request URLs.

@main.route(path):
    - Create mappings from URL path to the attached function.
    - path is relative to the site/hostname, e.g. '/index' maps to
    --> mysite.com/index

Misc Notes:
    - We can access the config.py variables via app.config dictionary.
"""

try:
    # Python3
    from http.client import TEMPORARY_REDIRECT
except ImportError:
    # Python2
    from httplib import TEMPORARY_REDIRECT

import json
from datetime import datetime
from flask import jsonify
from flask import flash, redirect
from flask import render_template
from flask import session, url_for, request, current_app

from app import db, api
from app.main import main
from app.main.forms import BasicForm, UserForm
from app.models import User, Post

from flask_restful import Resource

@main.before_app_first_request
def inject_theme():
    session['theme'] = current_app.config['DEFAULT_THEME']


@main.route('/new_theme', methods=['POST'])
def new_theme():
    session['theme'] = request.form['new_theme'].lower()
    return redirect(request.referrer)


@main.route('/', methods=['GET', 'POST'])
@main.route('/index', methods=['GET', 'POST'])
def index():
    # Load all User objects from db database.
    users = User.query.all()
    forms = {'user_form': UserForm()}
    form = forms['user_form']
    if form.validate_on_submit() and form.submit.data:
        session['nickname'] = forms['user_form'].nickname.data
        return redirect(url_for('.add_user'), code=TEMPORARY_REDIRECT)
    return render_template('index.html',
                           title='Home',
                           users=users,
                           forms=forms)


@main.route('/databases', methods=['GET', 'POST'])
def databases():
    # Load all User objects from db database.
    users = User.query.all()
    forms = {'user_form': UserForm()}
    form = forms['user_form']
    if form.validate_on_submit() and form.submit.data:
        flash('user_form valid')
        session['nickname'] = forms['user_form'].nickname.data
        return redirect(url_for('.add_user'), code=TEMPORARY_REDIRECT)
    return render_template('databases.html',
                           users=users,
                           forms=forms)


@main.route('/input_practice', methods=['GET', 'POST'])
def input_practice():

    # Create the form(s) used for this endpoint.
    forms = {'basic_form': BasicForm(),
             'user_form': UserForm()}

    form = forms['basic_form']
    if form.validate_on_submit() and form.submit.data:
        flash('basic_form validated. Message: {}'.format(
            forms['basic_form'].message.data))
        return redirect(url_for('.input_practice'))

    form = forms['user_form']
    if form.validate_on_submit() and form.submit.data:
        flash('user_form valid')
        session['nickname'] = forms['user_form'].nickname.data
        return redirect(url_for('.add_user'), code=TEMPORARY_REDIRECT)
    return render_template('input_practice.html', forms=forms)


@main.route('/add_user', methods=['POST'])
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


@main.route('/delete_user/<id>', methods=['POST'])
def delete_user(id):
    user = User.query.get_or_404(id)
    db.session.delete(user)
    db.session.commit()
    return redirect(request.referrer)


@main.route('/delete_post/<id>', methods=['POST'])
def delete_post(id):
    # TODO: make this via ajax so full page doesn't need to re-render.
    post = Post.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return redirect(request.referrer)


@main.route('/reference/<prefix>')
def reference(prefix):
    return render_template(
        'reference/{}_reference.html'.format(prefix),
        headers=request.headers)


@main.route('/games')
def games():
    return render_template('games.html')


class UserAPI(Resource):
    """Notes: 
     - Whenver the request is dispatched, a new instance of UserView is created and
      the dispatch_request() method is called with the params from url rule.
      - The class itself is instantiated with the params passed as_view().
    """

    def get(self, nickname=None):
        if nickname is None:
            # Return list of all users
            users = User.query.all()
            return [{'user_id': u.id, 'nickname': u.nickname} for u in users]
        else:
            # Return first user matching nickname or 404.
            user = User.query.filter_by(nickname=nickname).first_or_404()
            return {'user_id': user.id, 'nickname': user.nickname}

    def post(self, nickname=None):
        """Create a new user."""
        user = self._get_or_create(nickname)
        # Add and commit to database.
        db.session.add(user)
        db.session.commit()
        return {'user_id': user.id, 'nickname': user.nickname}

    def delete(self, nickname=None):
        """Delete user from db."""
        user = User.query.filter_by(nickname=nickname).first_or_404()
        db.session.delete(user)
        db.session.commit()
        return '', 204

    def _get_or_create(self, nickname):
        nickname = nickname.capitalize()
        user = User.query.filter_by(nickname=nickname).first()
        if user is None:
            user = User(nickname=nickname)
        return user


class PostAPI(Resource):

    def get(self, post_id=None):
        print("PostAPI.get called: post_id=", post_id)
        if post_id is None:
            # Return list of all users
            posts = Post.query.all()
            posts = [self._to_dict(p) for p in posts]
            return posts
        else:
            post = Post.query.get_or_404(post_id)
            return self._to_dict(post)

    def post(self, post_id=None):
        # Associate user and their post.
        if session.get('user') is None:
            redirect(url_for('404.html'))
        post = Post(
            body=request.form.get('post'), # TODO: rename to 'post_body'
            timestamp=datetime.utcnow(),
            author=User.get_or_404(session.get('user')))
        return self._to_json(post)

    def delete(self, post_id=None):
        post = Post.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        return '', 204

    def _to_dict(self, post):
        return {
            'id': post.id,
            'body': post.body,
            'timestamp': str(post.timestamp),
            'user_id': post.user_id}

    def _to_json(self, post):
        return jsonify(
            id=post.id,
            body=post.body,
            timestamp=json.dumps(post.timestamp),
            user_id=post.user_id)



api.add_resource(UserAPI, '/user', '/user/<string:nickname>', endpoint='user')
api.add_resource(PostAPI, '/user_post', '/user_post/<int:post_id>', endpoint='user_post')


