from flask import Flask
from importlib import import_module
from flask_cors import CORS  # Import CORS

def register_blueprints(app):
    """Dynamically register blueprints from modules."""
    modules = ['harvestingpredict', 'fertilizermanagement', 'diseasepredict', 'pestmanagement']
    for module_name in modules:
        module = import_module(f'apps.{module_name}.routes')
        app.register_blueprint(module.blueprint)

def create_app(config_class='config.Config'):
    """Create a Flask application."""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for all routes
    CORS(app, resources={r"/*": {"origins": "*"}})

    register_blueprints(app)
    return app
