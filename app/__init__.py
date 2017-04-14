"""app/__init__.py

Tutorial I:
    - Creates the flask application object.
    - Imports the views module.

Tutorial IV:
    - Create db, our SQLAlchemy database object.
    - We interact with db. via our classes in app/models.py.

Tutorial V:
    - Setup our login manager.
"""

import os
from flask import Flask
from flask_openid import OpenID
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from config import basedir

# Create flask application object.
app = Flask(__name__)
# Read and use info in config.py.
app.config.from_object('config')
# Initialize our database.
db = SQLAlchemy(app)

# Name clash: app package (below) != app object (above).
from app import views, models
