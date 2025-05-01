from flask import Blueprint

blueprint = Blueprint(
    'fertilizermanagement_blueprint',
    __name__,
    url_prefix='/harvesta-api/fertilizermanagement'
)

