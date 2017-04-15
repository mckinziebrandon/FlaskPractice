"""apps/forms.py: """

from wtforms import Form
from wtforms import StringField, BooleanField  # Desired form fields.
from wtforms.validators import DataRequired, InputRequired


class BasicForm(Form):
    message = StringField('message', validators=[InputRequired()])

