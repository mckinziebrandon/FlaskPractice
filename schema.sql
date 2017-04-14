/* Example SQLite instead of SQLAlchemy. For lighter apps.

Source: http://flask.pocoo.org/docs/0.12/tutorial/schema/#tutorial-schema

Description:
  - Single table named 'entries'.
  - Each row has columns:
    - id: an automatically incrementing integer and primary key.
    - title: str that must not be null.
    - text: str that must not be null.
 */
drop table if exists entries;
create table entries (
  id integer primary key autoincrement,
  title text not null,
  'text' text not null
);

