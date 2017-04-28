"""app/main/views.py: the handlers that respond to requests from browsers/other clients.
    - In Flask handlers are written as Python functions.
    - Each view function is mapped to one or more request URLs.

@main.route(path):
    - Create mappings from URL path to the attached function.
    - path is relative to the site/hostname, e.g. '/index' maps to
    --> mysite.com/index

Misc Notes:
    - We can access the config.py variables via app.config dictionary.
    - crud: 
        - create, read, update, and delte. 
        - the four basic functions of persistent storage.
        - the basic operations to be done in a data repository.
    - rest:
        - representational state transfer.
        - a style of architecture based on a set of principles that describe how
          networked resources are defined and addressed.
        - operates on resoure representations. typically not data objects, but complex
          data abstractions.
        - an app/architecture considered restful:
            - state and functionality are divided into distributed resources.
            - every resource is uniquely addressable using a minimal set of commands.
            - protocol is client/server, stateless, layered, and supports caching.
"""

try:
    # Python3
    from http.client import TEMPORARY_REDIRECT
except ImportError:
    # Python2
    from httplib import TEMPORARY_REDIRECT

import json
from datetime import datetime
from flask_restful import Resource, fields, marshal_with
from marshmallow import Schema, fields, post_load, pprint
from flask.views import View
from flask import session, url_for, request, current_app, render_template, \
        flash, redirect

from app import db, api
from app.main import main
from app.main.forms import BasicForm, UserForm
from app.models import User, Post


@main.before_app_first_request
def inject_theme():
    session['theme'] = current_app.config['DEFAULT_THEME']


@main.route('/new_theme', methods=['POST'])
def new_theme():
    session['theme'] = request.form['new_theme'].lower()
    return redirect(request.referrer)


class UserSchema(Schema):
    """UserSchema"""
    # id = fields.Integer()
    nickname = fields.String()
    posts = fields.Nested('PostSchema', many=True, exclude=('author', ))
    class Meta:
        fields = ('nickname', 'posts')

    @post_load
    def make_user(self, data):
        return User(**data)


class PostSchema(Schema):
    """PostSchema"""
    # id = fields.Integer()
    post = fields.String()
    timestamp = fields.DateTime()
    author = fields.Nested(UserSchema, only=['nickname'])
    class Meta:
        fields = ('body', 'timestamp', 'author')

    @post_load
    def make_post(self, data):
        return Post(**data)


class UserListAPI(Resource):
    """Accessing all User objects in the database."""

    def __init__(self):
        self.schema = UserSchema(many=True)

    def get(self):
        users = User.query.all()
        return self.schema.dump(users)


class UserAPI(Resource):
    """API for adding/creating/deleting users by specifying their nickname."""

    def __init__(self):
        self.schema = UserSchema()

    def get(self, nickname):
        user = User.query.filter_by(nickname=nickname).first_or_404()
        return self.schema.dump(user)

    def post(self, nickname):
        """Create a new user."""
        user = User.query.filter_by(nickname=request.value.get('nickname')).first()
        if user is None:
            user = User(nickname=request.values.get('nickname'))
        db.session.add(user)
        db.session.commit()
        return self.schema.dump(user)

    def _get_data(self, nickname):
        return {
            'nickname': nickname
        }

    def delete(self, nickname):
        """Delete user from db."""
        user = User.query.filter_by(nickname=nickname).first_or_404()
        db.session.delete(user)
        db.session.commit()
        return '', 204


class PostListAPI(Resource):

    def __init__(self):
        self.schema = PostSchema(many=True)

    def get(self):
        posts = Post.query.all()
        return self.schema.dump(posts)


class PostAPI(Resource):
    """API for adding/creating/deleting posts (as in blog posts) and their stored info
    from the SQLAlchemy database. [NEW]
    """

    def __init__(self):
        self.schema = PostSchema()

    def get(self, post_id):
        post = Post.query.get_or_404(post_id)
        return self.schema.dump(post)

    def post(self, post_id=None):
        # Associate user and their post.
        nickname = request.values.get('nickname')
        user_post = request.values.get('post')
        post_data = self._get_data(nickname, user_post)
        post = Post(**post_data)
        db.session.add(post)
        db.session.commit()
        return self.schema.dump(post)

    def delete(self, post_id):
        post = Post.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        return '', 204

    def _get_data(self, nickname, user_post):
        """For providing schema with dict (not kwargs!)."""
        # TODO: how to issue a GET to UserAPI? (to get author).
        return {
            'body': user_post,
            'timestamp': datetime.utcnow(),
            'author': User.query.filter_by(nickname=nickname).first()
        }


class RenderTemplate(View):
    """Notes: 
     - Whenver the request is dispatched, a new instance of UserView is created and
      the dispatch_request() method is called with the params from url rule.
      - The class itself is instantiated with the params passed as_view().
    """

    def __init__(self, **kwargs):
        if session.get('theme') is None:
            session['theme'] = current_app.config['DEFAULT_THEME']
        self.template_name = kwargs['template_name']

    def dispatch_request(self):
        return render_template(
            self.template_name,
            users=User.query.all(),
            forms={'basic_form': BasicForm(),
                   'user_form': UserForm()})


def add_render_template(name):
    main.add_url_rule(
        '/'+name,
        view_func=RenderTemplate.as_view(
            name,
            template_name=(name or 'index')+'.html'))


def add_reference(prefix):
    endpoint = prefix + '_reference'
    url = '/reference/' + endpoint
    template_name = url[1:] + '.html'
    main.add_url_rule(
        url,
        view_func=RenderTemplate.as_view(endpoint, template_name=template_name))


# -------------------------------------------------------
# BACKEND: Database Queries.
# -------------------------------------------------------

api.add_resource(UserListAPI, '/user', endpoint='users')
api.add_resource(UserAPI, '/user/<string:nickname>', endpoint='user')
api.add_resource(PostListAPI, '/user_post', endpoint='user_posts')
api.add_resource(PostAPI, '/user_post/<int:post_id>', '/new_user_post', endpoint='user_post')


# -------------------------------------------------------
# FRONTEND: HTML/Template Rendering.
# -------------------------------------------------------

# The main pages.
add_render_template('')
add_render_template('index')
add_render_template('input_practice')
add_render_template('databases')
add_render_template('games')

# The reference pages.
add_reference('jquery')
add_reference('javascript')
add_reference('canvas')
add_reference('flask')
add_reference('bootstrap')

