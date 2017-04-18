"""apps/forms.py: """

from flask_wtf import FlaskForm
from wtforms import Form
from wtforms import StringField, SubmitField # Desired form fields.
from wtforms.validators import DataRequired, InputRequired


class BasicForm(FlaskForm):
    """A FlaskForm with just one StringField containing a message."""
    message = StringField('message', validators=[InputRequired()])
    submit = SubmitField('Submit')

