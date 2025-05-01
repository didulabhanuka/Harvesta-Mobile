from flask import request, jsonify
from flask_cors import cross_origin
from . import blueprint
from .fertilizermanagement import inference_fertilization, inference_irrigation, get_fertilizer_history, get_irrigation_history
import os

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@blueprint.route('/irrigation', methods=['POST'])
@cross_origin()
def irrigation():
    return jsonify({"value": inference_irrigation(request.json)})

@blueprint.route('/fertilization', methods=['POST'])
@cross_origin()
def fertilization():
    return jsonify({"value": inference_fertilization(request.json)})

@blueprint.route('/fertilizer-history', methods=['GET'])
@cross_origin()
def fertilizer_history():
    result = get_fertilizer_history()
    if result['isSuccess']:
        return jsonify(result), 200
    else:
        return jsonify(result), 500


@blueprint.route('/irrigation-history', methods=['GET'])
@cross_origin()
def irrigation_history():
    result = get_irrigation_history()
    if result['isSuccess']:
        return jsonify(result), 200
    else:
        return jsonify(result), 500