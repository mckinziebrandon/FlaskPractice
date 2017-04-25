"""app/main/resources.py

Notes:
    - CRUD: 
        - Create, read, update, and delte. 
        - The four basic functions of persistent storage.
        - The basic operations to be done in a data repository.
    - REST:
        - Representational state transfer.
        - A style of architecture based on a set of principles that describe how
          networked resources are defined and addressed.
        - Operates on resoure representations. Typically not data objects, but complex
          data abstractions.
        - An app/architecture considered RESTful:
            - State and functionality are divided into distributed resources.
            - Every resource is uniquely addressable using a minimal set of commands.
            - Protocol is client/server, stateless, layered, and supports caching.
"""

from flask import request
from flask_restful import Resource
from app import db
# from app.main import main
from app.models import User, Post
from datetime import datetime


class UserAPI(Resource):
    """Notes: 
     - Whenver the request is dispatched, a new instance of UserView is created and
      the dispatch_request() method is called with the params from url rule.
      - The class itself is instantiated with the params passed as_view().
    """

    def get(self, user_id):
        user = User.query.get(user_id)
        return {user.nickname: user}

    def post(self, nickname):
        # Note: doesn't really make sense to 'post' a user_id, rather use nickname.
        # Get or create the user.
        user = User.query.filter_by(nickname=nickname).first()
        if user is None:
            user = User(nickname=nickname)
            # Associate user and their post.
            post = Post(body=request.form.get('post'),
                        timestamp=datetime.utcnow(),
                        author=user)
            # Add and commit to database.
            db.session.add_all([user, post])
            db.session.commit()

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204


# main.add_url_rule('/add_user', view_func=UserView.as_view('add_user'))

