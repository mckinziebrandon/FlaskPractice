#!/usr/bin/env python3

"""run.py: Starts up the development web server with our application. 

Command-line interface (pg 18 of flask reference):
    1. Launch the usual way (app.run(debug=True)):
    --> python3 run.py runserver
    
    2. Start a Python shell session in the context of the applciation.
    --> python3 run.py shell
"""

import os
from app import create_app, db
from app.models import User, Post
from flask_script import Manager, Shell
from flask_migrate import Migrate, MigrateCommand

app = create_app(os.getenv('FLASK_CONFIG') or 'default')
# For better CLI.
manager = Manager(app)
# Database tables can be created or upgraded with a single command:
# python3 manage.py db upgrade
migrate = Migrate(app, db)


def make_shell_context():
    """Automatic imports when we want to play in the shell."""
    return dict(app=app, db=db, User=User, Post=Post)
manager.add_command("shell", Shell(make_context=make_shell_context))
manager.add_command('db', MigrateCommand)


@manager.command
def test():
    """Run the unit tests (see the tests package).
    
    This can be run from the cmd line via 'python3 manage.py test'.
    
    Note: the decorator above allows us to define this as a custom method
    for our manager opbject.
    """
    import unittest
    tests = unittest.TestLoader().discover('tests')
    unittest.TextTestRunner(verbosity=2).run(tests)


if __name__ == '__main__':
    manager.run()
