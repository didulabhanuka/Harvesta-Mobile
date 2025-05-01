from flask import request, jsonify, send_file
import os
from apps.harvestingpredict import blueprint
from apps.harvestingpredict.harvestingpredict import process_images, get_historical_ripeness_data, get_latest_ripeness_data

# Ensure predictions directory exists
os.makedirs("static/predictions", exist_ok=True)

@blueprint.route('/predict', methods=['POST'])
def predict():
    """Handles multiple image uploads and returns a single summary output."""
    if 'files' not in request.files:
        return jsonify({"error": "No files uploaded"}), 400
    
    files = request.files.getlist('files')
    
    if len(files) == 0:
        return jsonify({"error": "No files provided"}), 400

    result = process_images(files)

    return jsonify(result)

@blueprint.route('/get_image/<path:filename>', methods=['GET'])
def get_image(filename):
    """Retrieve processed image by filename."""
    return send_file(f"static/predictions/{filename}", mimetype='image/jpeg')

@blueprint.route('/historical-data', methods=['GET'])
def historical_data():
    """API route to fetch the last 7 days of historical data."""
    data = get_historical_ripeness_data()
    if data is None:
        return jsonify({"error": "Failed to fetch historical data"}), 500
    return jsonify({"historical_data": data})

@blueprint.route('/latest-data', methods=['GET'])
def latest_data():
    """API route to fetch the latest ripeness data from Firebase Firestore."""
    latest_data = get_latest_ripeness_data()

    if latest_data:
        return jsonify({"latest_data": latest_data})
    
    return jsonify({"error": "No data found"}), 404

