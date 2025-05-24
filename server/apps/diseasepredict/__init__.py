from flask import Blueprint

# Create the blueprint for disease prediction
blueprint = Blueprint('diseasepredict_blueprint', __name__, url_prefix='/harvesta-api/diseasepredict')

# Register the blueprint with your Flask app in your main file
