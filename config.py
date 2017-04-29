import os
from flask_basicauth import BasicAuth
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:

    DEFAULT_THEME = 'lumen'
    # Boolean: True if you == Brandon McKinze; False otherwise :)
    FLASK_PRACTICE_ADMIN = os.getenv('FLASK_PRACTICE_ADMIN', 'false')
    # Activates the cross-site request forgery prevention.
    WTF_CSRF_ENABLED = True
    # Used to create cryptographic token used to valide a form.
    SECRET_KEY = os.getenv('SECRET_KEY', 'not-really-a-secret-now')

    # __________ SQLAlchemy Configuration __________
    # Suppress error from package itself.
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Folder where we'll store SQLAlchemy-migrate data files.
    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
    # Commit the database when app closes.
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True

    # Username/password for flask admin access.
    BASIC_AUTH_USERNAME = os.getenv('BASIC_AUTH_USERNAME', 'admin')
    BASIC_AUTH_PASSWORD = os.getenv('BASIC_AUTH_PASSWORD', 'password')

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    # Path of our db file. Required by Flask-SQLAlchemy extension.
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DEV_DATABASE_URL',
        'sqlite:///' + os.path.join(basedir, 'data_dev.db'))


class TestingConfig(Config):
    TESTING = True
    # Path of our db file. Required by Flask-SQLAlchemy extension.
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'TEST_DATABASE_URL',
        'sqlite:///' + os.path.join(basedir, 'data_test.db'))


class ProductionConfig(Config):
    # Path of our db file. Required by Flask-SQLAlchemy extension.
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'sqlite:///' + os.path.join(basedir, 'data.db'))

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': ProductionConfig
}
