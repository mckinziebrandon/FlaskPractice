"""apps/forms.py: """

from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField  # Desired form fields.
from wtforms.validators import DataRequired


class LoginForm(FlaskForm):
    """Information requested of user upon login.
        - Form base class knows how to render form fields as HTML.
        - Any [Name]Field object will get rendered where it's called in our templates.
    """

    # For us, only validation is that input is 'truthy' (i.e. exists).
    # - openid is callable from our html. For example, we collect it via:
    #   >>> {{ form.openid(size=80) }}
    openid      = StringField('openid', validators=[DataRequired()])
    # Whether or not we should store user's info for later.
    remember_me = BooleanField('remember_me', default=False)

    ignore_auth = BooleanField('ignore_auth', default=True)
