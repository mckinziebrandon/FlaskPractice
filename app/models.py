"""app/models.py: Tutorial IV - Databases.

database models: collection of classes whose purpose is to represent the
                 data that we will store in our database.

The ORM layer (SQLAlchemy) will do the translations required to map
objects created from these classes into rows in the proper database table.
    - ORM: Object Relational Mapper; links b/w tables corresp. to objects.
"""

from app import db, app
from flask import session, url_for, request, g
from flask_sqlalchemy import SQLAlchemy


class User(db.Model):
    """A model that represents our users.

    Jargon/Parameters:
        - primary key: unique id given to each user.
        - varchar: a string.
        - db.Column parameter info:
            - index=True: allows for faster queries by associating a given column
                          with its own index. Use for values frequently looked up.
            - unique=True: don't allow duplicate values in this column.

    Fields:
        id: (db.Integer) primary_key for identifying a user in the table.
        nickname: (str)
        posts: (db.relationship)

    """

    # Fields are defined as class variables, but are used by super() in init.
    # Pass boolean args to indicate which fields are unique/indexed.
    # Note: 'unique' here means [a given user] 'has only one'.
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(64), index=True, unique=True)
    # Relationships are not actual database fields (not shown on a db diagram).
    # They are typically on the 'one' side of a 'one-to-many' relationship.
    # - backref: *defines* a field that will be added to the instances of
    #             Posts that point back to this user.
    # - lazy='dynamic': "Instead of loading the items, return another query
    #                    object which we can refine before loading items.
    posts = db.relationship('Post', backref='author', lazy='dynamic')

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

    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.String(140))
    timestamp = db.Column(db.DateTime)
    # Establish link bw foreign key (user_id) and 'id' field of
    # table it refers to. One-to-many: one user writes many posts.
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post %r>' % self.body

