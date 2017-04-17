"""apps/forms.py: """

from flask_wtf import FlaskForm
from wtforms import Form
from wtforms import StringField, BooleanField  # Desired form fields.
from wtforms.validators import DataRequired, InputRequired


class BasicForm(FlaskForm):
    message = StringField('message', validators=[InputRequired()])

