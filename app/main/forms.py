"""apps/main/forms.py: """

from flask_wtf import FlaskForm
from wtforms import Form
from wtforms import StringField, SubmitField, TextAreaField
from flask_pagedown.fields import PageDownField
from wtforms.validators import DataRequired, InputRequired
from wtforms.validators import Length, NoneOf
from wtforms.validators import ValidationError


def bad_chars(form, string_field):
    for c in r";'`":
        if c in string_field.data:
            raise ValidationError('DONT TYPE DAT')


class BasicForm(FlaskForm):
    """A FlaskForm with just one StringField containing a message."""
    message = StringField('message', validators=[InputRequired()])
    submit = SubmitField('Submit')


class UserForm(FlaskForm):
    """Form for creating/editing a user."""
    nickname = StringField('nickname', validators=[DataRequired(), bad_chars])
    post = PageDownField('post', validators=[DataRequired()])
    submit = SubmitField('Submit')


