
from flask import request, jsonify
from apps.diseasepredict import blueprint

from datetime import datetime
from apps.firebase_config import initialize_firebase
from apps.diseasepredict.diseasepredict import (
    predict_disease_and_severity,
    update_selected_actions
)

db = initialize_firebase()

# @blueprint.route('/predict', methods=['POST'])
# def predict_route():
#     if 'file' not in request.files:
#         return jsonify({"error": "No file part"}), 400
#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({"error": "Empty filename"}), 400

#     try:
#         result = predict_disease_and_severity(file.stream)
#         return jsonify(result), 201
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500
# @blueprint.route('/predict', methods=['POST'])
# def predict_route():
#     try:
#         file = request.files['file']
#         if not file:
#             return jsonify({"error": "No file uploaded"}), 400

#         result = predict_disease_and_severity(file.stream)
#         if not result:
#             return jsonify({"error": "Prediction failed"}), 500

#         return jsonify(result), 201
#     except Exception as e:
#         print("Prediction error:", e)
#         return jsonify({"error": str(e)}), 500

@blueprint.route('/predict', methods=['POST'])
def predict_route():
    # 1) Validate the upload
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    # 2) Run your prediction + Firestore save
    try:
        result = predict_disease_and_severity(file.stream)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # 3) Make sure Firestore returned a reportId
    report_id = result.get("reportId")
    if not report_id:
        return jsonify({"error": "Failed to save prediction"}), 500

    # 4) Return everything your app needs in one shot
    return jsonify({
        "reportId":              report_id,
        "predicted_disease":     result["predicted_disease"],
        "predicted_severity":    result["predicted_severity"],
        "recommendations_by_day": result["recommendations_by_day"],
        "image_base64":          result["image_base64"],
    }), 201





# @blueprint.route('/history', methods=['POST'])
# def save_history_route():
#     data = request.get_json()
#     print("Received data:", data)  # Debug print

#     report_id = data.get('reportId') if data else None
#     day = data.get('day') if data else None
#     completed_actions = data.get('completedActions') if data else None

#     # Validate input strictly
#     if not (report_id and isinstance(report_id, str) and
#             day is not None and isinstance(day, int) and
#             isinstance(completed_actions, list)):
#         print("Invalid data received")
#         return jsonify({"error": "Invalid data"}), 400

#     try:
#         field = f"selected_actions.Day{day}"
#         db.collection("disease_reports").document(report_id).update({field: completed_actions})
#         return jsonify({"message": "History saved successfully"}), 200
#     except Exception as e:
#         print(f"Error updating Firestore: {e}")
#         return jsonify({"error": str(e)}), 500
@blueprint.route('/save_selected_actions', methods=['POST'])
def save_selected_actions():
    data = request.get_json() or {}
    report_id       = data.get('reportId')
    day             = data.get('day')
    selected_actions = data.get('selectedActions')

    if not (
        isinstance(report_id, str) and
        isinstance(day, int) and
        isinstance(selected_actions, list)
    ):
        return jsonify({"error": "Invalid data"}), 400

    try:
        # This only writes into selected_actions.Day{day}, leaving other days untouched
        db.collection("disease_reports") \
          .document(report_id) \
          .update({
            f"selected_actions.Day{day}": selected_actions
          })
        return jsonify({"message": "Selected actions saved successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@blueprint.route('/history/<report_id>', methods=['GET'])
def get_history_route(report_id):
    try:
        doc = db.collection("disease_reports") \
                .document(report_id) \
                .get() \
                .to_dict() or {}
        return jsonify({"selected_actions": doc.get("selected_actions", {})}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    




@blueprint.route('/reports', methods=['GET'])
def list_reports():
    """Return basic info (including selected_actions) for all saved reports."""
    try:
        docs = db.collection("disease_reports").stream()
        out = []
        for doc in docs:
            data = doc.to_dict() or {}
            out.append({
                "reportId": doc.id,
                "predicted_disease": data.get("predicted_disease"),
                "predicted_severity": data.get("predicted_severity"),
                "timestamp": data.get("timestamp"),
                "image_base64": data.get("image_base64"),   # or a shorter thumbnail
                "selected_actions": data.get("selected_actions", {})  # <-- grab this
            })
        return jsonify({"reports": out}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@blueprint.route('/reports/<report_id>', methods=['GET'])
def get_report(report_id):
    """Return the full document for one report."""
    try:
        doc_snap = db.collection("disease_reports").document(report_id).get()
        if not doc_snap.exists:
            return jsonify({"error": "Not found"}), 404
        data = doc_snap.to_dict()
        data["reportId"] = report_id
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
