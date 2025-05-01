from flask import request, jsonify
from apps.diseasepredict import blueprint  # Correct import from __init__.py

@blueprint.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Call the function to perform disease prediction
    from apps.diseasepredict import diseasepredict  # Import here to avoid circular imports
    result = diseasepredict.predict_disease_and_severity(file)
    return jsonify(result)
