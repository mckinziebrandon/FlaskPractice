"""app/__init__.py: Initialize session objects."""

from flask import Flask
from flask_moment import Moment
from flask_pagedown import PageDown
from flask_sqlalchemy import SQLAlchemy

from config import config

# Initialize our database.
db = SQLAlchemy()
# Nice thingy for displaying dates/times.
moment = Moment()
# Client-sdie Markdown-to-HTML converter implemented in JS.
pagedown = PageDown()


def create_app(config_name):
    """The application factory, which allows the app to be created at runtime. This is
    in contrast to before, where it was created in the global scope (i.e. no way to 
    apply configuration changes dynamically).
    
    Returns:
        app: the created application instance. Note that the app is still incomplete,
            as it is missing routes and custom error page handlers, which will be
            handled by blueprints.
    """

    # Create flask application object, and
    # read/use info in config.py.
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    # Initialize our database.
    db.init_app(app)
    # Nice thingy for displaying dates/times.
    moment.init_app(app)
    # Client-sdie Markdown-to-HTML converter implemented in JS.
    pagedown.init_app(app)
    
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app

