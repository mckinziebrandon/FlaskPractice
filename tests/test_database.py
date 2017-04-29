"""Unit tests for the application."""

from flask import current_app
from flask import request
from app import create_app, db
from app.models import User, Post
from app.main.views import UserSchema, PostSchema

import sys
import unittest
import sqlite3
import sqlalchemy


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

    def test_maybe_create(self):
        """Ensure proper errors raised on bad db ops."""

        db.drop_all()
        self.assertRaises(sqlalchemy.exc.OperationalError, User.query.all)
        self.assertRaises(sqlalchemy.exc.OperationalError, Post.query.all)
        db.create_all()






