"""app/main/views.py: routing and REST api. Notes:
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
        - operates on resoure representations. typically not data objects, 
          but complex data abstractions.
        - an app/architecture considered restful:
            - state and functionality are divided into distributed resources.
            - every resource is uniquely addressable with minimal set of cmds.
            - protocol is client/server, stateless, layered, supports caching.
"""


from flask import make_response
from werkzeug.exceptions import HTTPException

try:
    # Python3
    from http.client import TEMPORARY_REDIRECT
except ImportError:
    # Python2
    from httplib import TEMPORARY_REDIRECT

from datetime import datetime
from flask_restful import Resource, fields
import flask_basicauth
from marshmallow import Schema, fields, post_load
from flask.views import View
from flask import session, url_for, request, current_app, render_template, \
        flash, redirect
from flask_admin.contrib import sqla

from app import db, api, admin, basic_auth
from app.main import main
from app.main.forms import BasicForm, UserForm
from app.models import User, Post


@main.before_app_first_request
def inject_theme():
    session['theme'] = current_app.config['DEFAULT_THEME']

@main.route('/new_theme', methods=['POST'])
def new_theme():
    """bootswatch.js issues POST requests here when updating the site theme."""
    session['theme'] = request.form.get('new_theme', 'lumen').lower()
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
    id = fields.Integer()
    post = fields.String()
    timestamp = fields.DateTime()
    author = fields.Nested(UserSchema, only=['nickname'])
    class Meta:
        fields = ('id', 'body', 'timestamp', 'author')

    @post_load
    def make_post(self, data):
        return Post(**data)


class UserListAPI(Resource):
    """Operations related to the pool of users:
        - GET: get the list of User objects stored in db.
        - POST: add another user to the db pool.
    """

    def get(self):
        users = User.query.all()
        return UserSchema(many=True).dump(users)

    def post(self, return_all=False):
        """Create a new user, add to our list of users."""
        nickname = (request.values.get('nickname', 'Anon')).capitalize()
        session['nickname'] = nickname
        user = User.query.filter_by(nickname=nickname).first()
        if user is None:
            user = User(nickname=nickname)
            db.session.add(user)
            db.session.commit()
        # Return the updated list of all users.
        schema = UserSchema(many=return_all)
        if return_all:
            return schema.dump(User.query.all())
        else:
            return schema.dump(user)


class UserAPI(Resource):
    """Operations on a specific user, given by their nickname.
        - GET: get the specified user object.
        - DELETE: deleteUser the given user from the db.
    """

    def get(self, nickname):
        nickname = nickname.capitalize()
        user = User.query.filter_by(nickname=nickname).first_or_404()
        return UserSchema().dump(user)

    @basic_auth.required
    def delete(self, nickname):
        """Delete user from db."""
        nickname = nickname.capitalize()
        user = User.query.filter_by(nickname=nickname).first_or_404()
        db.session.delete(user)
        db.session.commit()
        return 'User {} deleted.'.format(nickname), 204


class PostListAPI(Resource):

    def get(self):
        posts = Post.query.all()
        return PostSchema(many=True).dump(posts)

    def post(self, return_all=False):
        # Associate user and their post.
        nickname = (request.values.get('nickname', 'Anon')).capitalize()
        user_post = request.values.get('post')
        post_data = self._get_data(nickname, user_post)
        post = Post(**post_data)
        db.session.add(post)
        db.session.commit()

        if return_all:
            return PostSchema(many=True).dump(Post.query.all())
        else:
            return PostSchema().dump(post)

    def _get_data(self, nickname, user_post):
        """For providing schema with dict (not kwargs!)."""
        return {
            'body': user_post,
            'timestamp': datetime.utcnow(),
            'author': User.query.filter_by(nickname=nickname).first()}


class PostAPI(Resource):
    """API for adding/creating/deleting posts (as in blog posts) and their 
    stored info from the SQLAlchemy database. [NEW]
    """

    def get(self, post_id):
        post = Post.query.get_or_404(post_id)
        return PostSchema().dump(post)

    @basic_auth.required
    def delete(self, post_id):
        post = Post.query.get_or_404(post_id)
        db.session.delete(post)
        db.session.commit()
        return 'Post {} deleted.'.format(post_id), 204


class RenderTemplate(View):
    """Notes:
     -  Whenever the request is dispatched, a new instance of UserView is 
        created and the dispatch_request() method is called with the params 
        from baseURL rule.
      - The class itself is instantiated with the params passed as_view().
    """

    def __init__(self, **kwargs):
        if session.get('theme') is None:
            session['theme'] = current_app.config.get('DEFAULT_THEME', 'lumen')
        self.template_name = kwargs.get('template_name', '404.html')

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
    main.add_url_rule(url, view_func=RenderTemplate.as_view(
        endpoint, template_name=template_name))


@main.route('/render_post')
def render_post():
    post = Post.query.get_or_404(request.values.get('post_id'))
    return render_template('macros/request_templates.html',
                           post=post)


@main.route('/render_user')
def render_user():
    user = User.query.filter_by(nickname=request.values.get('nickname')).first()
    return render_template('macros/request_templates.html', user=user)


# -------------------------------------------------------
# BACKEND: Database Queries.
# -------------------------------------------------------

api.add_resource(UserAPI, '/user/<string:nickname>', endpoint='user')
api.add_resource(UserListAPI, '/user', endpoint='users')

api.add_resource(PostAPI, '/user_post/<int:post_id>', endpoint='user_post')
api.add_resource(PostListAPI, '/user_post', endpoint='user_posts')


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


# -------------------------------------------------------
# ADMIN: Authentication for the admin (me) on /admin.
# -------------------------------------------------------


class AuthException(HTTPException):
    def __init__(self, message):
        super().__init__(message, make_response(
            "You could not be authenticated. Please refresh the page.", 401,
            {'WWW-Authenticate': 'Basic realm="Login Required"'}))


class ModelView(sqla.ModelView):
    def is_accessible(self):
        if not basic_auth.authenticate():
            raise AuthException('Not authenticated.')
        else:
            return True

    def inaccessible_callback(self, name, **kwargs):
        return redirect(basic_auth.challenge())

admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Post, db.session))

