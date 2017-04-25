import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:

    FLASK_PRACTICE_ADMIN = os.environ.get('FLASK_PRACTICE_ADMIN')
    # Activates the cross-site request forgery prevention.
    WTF_CSRF_ENABLED = True
    # Used to create cryptographic token used to valide a form.
    SECRET_KEY = (os.environ.get('SECRET_KEY') or 'not-really-a-secret-now')

    # __________ SQLAlchemy Configuration __________
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Suppress error from package itself.
    # Folder where we'll store SQLAlchemy-migrate data files.
    SQLALCHEMY_MIGRATE_REPO = os.path.join(basedir, 'db_repository')
    # Commit the database when app closes.
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True

    @staticmethod
    def init_app(app):
        pass


class DevelopmentConfig(Config):
    DEBUG = True
    # Path of our db file. Required by Flask-SQLAlchemy extension.
    SQLALCHEMY_DATABASE_URI = (os.environ.get('DEV_DATABASE_URL') or
                               'sqlite:///' + os.path.join(basedir, 'data_dev.db'))


class TestingConfig(Config):
    TESTING = True
    # Path of our db file. Required by Flask-SQLAlchemy extension.
    SQLALCHEMY_DATABASE_URI = (os.environ.get('TEST_DATABASE_URL') or
                               'sqlite:///' + os.path.join(basedir, 'data_test.db'))


class ProductionConfig(Config):
    # Path of our db file. Required by Flask-SQLAlchemy extension.
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'data.db')


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': ProductionConfig
}
