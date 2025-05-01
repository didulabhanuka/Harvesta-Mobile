from flask import Blueprint

blueprint = Blueprint(
    'diseasepredict_blueprint',
    __name__,
    url_prefix='/harvesta-api/diseasepredict'
)
