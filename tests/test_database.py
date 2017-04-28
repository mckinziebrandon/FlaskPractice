"""Unit tests for the application."""

import unittest
from flask import current_app
from app import create_app, db
from app.models import User, Post
from app.main.views import UserSchema, PostSchema


class TestDatabase(unittest.TestCase):

    def setUp(self):
        """Called before running a test."""
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        """Called after running a test."""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_app_exists(self):
        self.assertFalse(current_app is None)

    def test_add_user(self):
        """Add a new user model to the db."""

        # Create.
        new_user = User(nickname='New User')
        self.assertIsInstance(new_user, User)
        self.assertEqual(new_user.posts.count(), 0)

        # Store.
        db.session.add(new_user)
        db.session.commit()

        # Serialize.
        dump = UserSchema().dump(new_user)
        self.assertTrue('nickname' in dump.data)

