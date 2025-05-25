
from flask import request, jsonify, current_app, send_from_directory
from apps.pestmanagement import blueprint
from apps.pestmanagement.pestmanagement import inference_pests
from apps.pestmanagement.pestmanagement import get_pest_detection_history
import os

# Route to serve images
@blueprint.route('/uploads/<filename>', methods=['GET'])
def serve_image(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)

@blueprint.route('/pests', methods=['POST'])
def pests():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    image = request.files['image']
    
    # Ensure the uploads directory exists
    upload_folder = current_app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)

    image_path = os.path.join(upload_folder, image.filename)
    image.save(image_path)
    
    result = inference_pests(image_path)
    return jsonify({"pest": result})

@blueprint.route('/pests/history', methods=['GET'])
def get_pests_history():
    history = get_pest_detection_history()

    if "error" in history:
        return jsonify({"error": history["error"]}), 500

    return jsonify({"history": history})

@blueprint.route('/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(blueprint.root_path, 'uploads'), filename)
