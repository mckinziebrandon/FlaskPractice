"""app/__init__.py: Initialize session objects."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_script import Manager, Shell
from flask_moment import Moment
from config import config

# Create flask application object.
app = Flask(__name__)
# Read and use info in config.py.
app.config.from_object(config['default'])
# Initialize our database.
db = SQLAlchemy(app)
# For better CLI.
manager = Manager(app)
# Nice thingy for displaying dates/times.
moment = Moment(app)


def make_shell_context():
    """Automatic imports when we want to play in the shell."""
    return dict(app=app, db=db)
manager.add_command('shell', Shell(make_context=make_shell_context))


# Name clash: app package (below) != app object (above).
from app import views, models
