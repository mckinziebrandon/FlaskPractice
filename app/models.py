"""app/models.py: Tutorial IV - Databases.

database models: collection of classes whose purpose is to represent the
                 data that we will store in our database.

The ORM layer (SQLAlchemy) will do the translations required to map
objects created from these classes into rows in the proper database table.
    - ORM: Object Relational Mapper; links b/w tables corresp. to objects.
"""

from app import db, app
from flask import session, url_for, request, g
from flask_login import LoginManager, UserMixin
from flask_sqlalchemy import SQLAlchemy


class User(db.Model):
    """A model that represents our users.

    Jargon:
        - primary key: unique id given to each user.
        - varchar: a string.

    Fields:
        id: (db.Integer) primary_key for identifying a user in the table.
        nickname: (str)
        email: (str)
        posts: (db.relationship)

    All properties were defined in Tutorial V for compatibility with Flask-Login.
    """

    __tablename__ = 'users'

    # Fields are defined as class variables for some reason.
    # (Yes, this is terrible design but we have no choice).
    # Pass boolean args to indicate which fields are unique/indexed.
    # Note: 'unique' here means [a given user] 'has only one'.
    id          = db.Column(db.Integer, primary_key=True)
    #social_id   = db.Column(db.String(64), nullable=False, unique=True)
    nickname    = db.Column(db.String(64), index=True, unique=True)
    email       = db.Column(db.String(128), index=True, unique=True)
    # Relationships are not actual database fields (not shown on a db diagram).
    # They are typically on the 'one' side of a 'one-to-many' relationship.
    # - backref: *defines* a field that will be added to the instances of
    #             Posts that point back to this user.
    posts       = db.relationship('Post', backref='author', lazy='dynamic')

    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

    def __repr__(self):
        return '<User %r>' % self.nickname


class Post(db.Model):
    """A model for posts that were created by a user.

    Fields:
        id: (db.Integer)
        body: (db.String)
        timestamp: (db.DateTime)
        user_id: (db.Integer)
    """

    id          = db.Column(db.Integer, primary_key=True)
    body        = db.Column(db.String(140))
    timestamp   = db.Column(db.DateTime)
    # Establish link bw foreign key (user_id) and 'id' field of table it refers to.
    # One-to-many: one user writes many posts.
    user_id     = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post %r>' % self.body


class OAuthSignIn(object):
    providers = None

    def __init__(self, provider_name):
        self.provider_name = provider_name
        credentials = app.config['OAUTH_CREDENTIALS'][provider_name]
        self.consumer_id = credentials['id']
        self.consumer_secret = credentials['secret']

    def authorize(self):
        pass

    def callback(self):
        pass

    def get_callback_url(self):
        return url_for('oauth_callback', provider=self.provider_name,
                       _external=True)

    @classmethod
    def get_provider(self, provider_name):
        if self.providers is None:
            self.providers = {}
            for provider_class in self.__subclasses__():
                provider = provider_class()
                self.providers[provider.provider_name] = provider
        return self.providers[provider_name]


class FacebookSignIn(OAuthSignIn):
    pass


class TwitterSignIn(OAuthSignIn):
    pass
