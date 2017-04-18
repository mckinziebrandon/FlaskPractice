"""apps/forms.py: """

from flask_wtf import FlaskForm
from wtforms import Form
from wtforms import StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, InputRequired, Length


class BasicForm(FlaskForm):
    """A FlaskForm with just one StringField containing a message."""
    message = StringField('message', validators=[InputRequired()])
    submit = SubmitField('Submit')


class UserForm(FlaskForm):
    """Form for creating/editing a user."""
    nickname = StringField('nickname', validators=[DataRequired()])
    post = TextAreaField('post', validators=[Length(min=0, max=140)])

