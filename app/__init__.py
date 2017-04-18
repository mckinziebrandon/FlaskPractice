"""app/__init__.py: Initialize session objects."""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap
from flask_script import Manager
from flask_moment import Moment

# Create flask application object.
app = Flask(__name__)
# Read and use info in config.py.
app.config.from_object('config')
# Initialize our database.
db = SQLAlchemy(app)
# Add support for quick bootstrappin.
bootstrap = Bootstrap(app)
# For better CLI.
manager = Manager(app)
# Nice thingy for displaying dates/times.
moment = Moment(app)

# Name clash: app package (below) != app object (above).
from app import views, models
