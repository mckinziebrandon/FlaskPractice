"""Unit tests for the application."""

import unittest
from flask import current_app
from flask import request
from app import create_app, db
from app.models import User, Post
from app.main.views import UserSchema, PostSchema

from requests import get, post


class TestDatabase(unittest.TestCase):

    def setUp(self):
        """Called before running a test."""
        self.app = create_app('testing')
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.url_root = request.url_root
        db.create_all()

    def tearDown(self):
        """Called after running a test."""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_app_exists(self):
        self.assertFalse(current_app is None)

    def test_user_list_api(self):
        """Add a new user model to the db."""

        nickname = 'Sally'
        response = post(self.url_root + '/user', data={'nickname': nickname})
        print(response)

