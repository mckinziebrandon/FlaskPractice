import os
basedir = os.path.abspath(os.path.dirname(__file__))

SQLALCHEMY_TRACK_MODIFICATIONS = False  # Suppress error from package itself.
# Path of our db file. Required by Flask-SQLAlchemy extension.
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
# Folder where we'll store SQLAlchemy-migrate data files.
SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')


# Activates the cross-site request forgery prevention.
WTF_CSRF_ENABLED = True
# Used to create cryptographic token used to valide a form.
SECRET_KEY = 'you-might-guess-if-you-are-clever'

# Define the list of supported OpenID providers.
# We will use it for our login in views.py and login.html.
OPENID_PROVIDERS = [
    {'name': 'Yahoo', 'url': 'https://me.yahoo.com'},
    {'name': 'Flickr', 'url': 'http://www.flickr.com/<username>'},
    {'name': 'MyOpenID', 'url': 'https://www.myopenid.com'}
]

OAUTH_CREDENTIALS = {
    'facebook': {
        'id': '470154729788964',
        'secret': '010cc08bd4f51e34f3f3e684fbdea8a7'
    }
}
