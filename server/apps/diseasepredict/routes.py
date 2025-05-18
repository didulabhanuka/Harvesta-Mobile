from flask import request, jsonify
from apps.diseasepredict import blueprint
from apps.diseasepredict.diseasepredict import predict_disease_and_severity

@blueprint.route('/predict', methods=['POST'])
def predict():
    """Handles multiple image uploads and returns a single summary output."""
    # Check if the 'file' key exists in the request files
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    # Get the uploaded file
    file = request.files['file']
    
    # Check if no file was selected
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Call the function to perform disease prediction
    try:
        result = predict_disease_and_severity(file)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
