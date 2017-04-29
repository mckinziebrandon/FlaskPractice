#!/usr/bin/env python3

"""manage.py: Start up the web server and the application."""

import os
import sqlalchemy
from app import create_app, db
from app.models import User, Post
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand

app = create_app(os.getenv('FLASK_CONFIG', 'default'))
# For better CLI.
manager = Manager(app)
# Database tables can be created or upgraded with a single command:
# python3 manage.py db upgrade
migrate = Migrate(app, db)


def make_shell_context():
    """Automatic imports when we want to play in the shell."""
    return dict(app=app, db=db, User=User, Post=Post)

manager.add_command("shell", Shell(make_context=make_shell_context))

# Give manager 'db' command.
# Now, 'manage.py db [options]' runs the flask_migrate.Migrate method.
manager.add_command('db', MigrateCommand)


@manager.command
def test():
    """Run the unit tests (see the tests package).

    This can be run from the cmd line via 'python3 manage.py test'.

    Note: the decorator above allows us to define this as a custom method
    for our manager object.
    """
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)


@manager.command
def deploy():
    from flask_migrate import upgrade
    maybe_create_tables(db)
    # Migrate db to latest revision.
    upgrade()


def maybe_create_tables(database):
    """ Create tables if they don't exist. """
    with app.app_context():
        try:
            User.query.all()
            Post.query.all()
        except sqlalchemy.exc.OperationalError:
            db.create_all()


if __name__ == '__main__':
    maybe_create_tables(db)
    manager.run()
