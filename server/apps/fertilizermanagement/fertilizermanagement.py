import pickle
import numpy as np
import pandas as pd
import firebase_admin
from firebase_admin import credentials, firestore
from typing import Dict, Any
from flask import jsonify

# Firebase Initialization (Only initialize once)
if not firebase_admin._apps:
    cred = credentials.Certificate("harvesta-24-25j-250-firebase-adminsdk.json")  # Add your Firebase credentials
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Load Models
with open("apps/fertilizermanagement/artifacts/fertillization.pkl", "rb") as f:
    cls_fertillization = pickle.load(f)

with open("apps/fertilizermanagement/artifacts/irrigation.pkl", "rb") as f:
    cls_irrigation = pickle.load(f)

def inference_fertilization(fertilizer_json: Dict[str, Any]) -> Dict[str, Any]:
    """Predicts fertilization value and stores it in Firebase Firestore."""
    print("Received JSON:", fertilizer_json)  # Debugging

    # Validate input fields
    required_fields = ["SoilN", "SoilP", "SoilK", "PlantAge", "FertilizerType"]
    if not all(k in fertilizer_json for k in required_fields):
        return {"error": "Missing required fields"}, 400  # Ensure all fields are present

    # Rename keys to match expected format
    fertilizer_json["N"] = fertilizer_json.pop("SoilN")
    fertilizer_json["P"] = fertilizer_json.pop("SoilP")
    fertilizer_json["K"] = fertilizer_json.pop("SoilK")

    # Prepare DataFrame for model
    df = pd.DataFrame([fertilizer_json])
    df['FertilizerType'] = df['FertilizerType'].str.replace('NPK ', '')  # Clean FertilizerType
    df[['FertN', 'FertP', 'FertK']] = df['FertilizerType'].str.split('-', expand=True).astype(int)
    df.drop(columns=['FertilizerType'], inplace=True)
    X = df.values

    try:
        # Predict and round result
        result = round(cls_fertillization.predict(X)[0], 2)

        # Store in Firestore
        db.collection("fertilization_results").add({
            "SoilN": fertilizer_json["N"],
            "SoilP": fertilizer_json["P"],
            "SoilK": fertilizer_json["K"],
            "PlantAge": fertilizer_json["PlantAge"],
            "FertilizerType": fertilizer_json["FertilizerType"],
            "FertilizationValue": result
        })

        return {"FertilizationValue": result}
    
    except Exception as e:
        print("Error during prediction or Firestore update:", e)
        return {"error": "Failed to process fertilization request"}, 500


def inference_irrigation(irrigation_json: Dict[str, Any]) -> Dict[str, Any]:
    """Predicts irrigation value and stores it in Firebase Firestore."""
    print("Received JSON:", irrigation_json)  # Debugging

    # Validate input fields
    required_fields = ["PlantAge", "SoilMoisture"]
    if not all(k in irrigation_json for k in required_fields):
        return {"error": "Missing required fields"}, 400  # Ensure all fields are present

    # Prepare DataFrame for model
    df = pd.DataFrame([irrigation_json])
    X = df.values

    try:
        # Predict and round result
        result = round(cls_irrigation.predict(X)[0], 2)

        # Store in Firestore
        db.collection("irrigation_results").add({
            "PlantAge": irrigation_json["PlantAge"],
            "SoilMoisture": irrigation_json["SoilMoisture"],
            "IrrigationValue": result
        })

        return {"IrrigationValue": result}
    
    except Exception as e:
        print("Error during prediction or Firestore update:", e)
        return {"error": "Failed to process irrigation request"}, 500


def get_fertilizer_history():
    try:
        # Fetch fertilizer data from Firebase
        fertilizer_ref = db.collection('fertilization_results').order_by('PlantAge')
        docs = fertilizer_ref.stream()

        # Process data
        fertilizer_data = []
        for doc in docs:
            doc_data = doc.to_dict()
            print(f"Fetched doc: {doc_data}")  # Debugging line to see data

            # Check for the correct field names
            if 'PlantAge' in doc_data and 'SoilN' in doc_data and 'SoilP' in doc_data and 'SoilK' in doc_data:
                # Check for FertilizerValue or FertilizationValue
                if 'FertilizerValue' in doc_data or 'FertilizationValue' in doc_data:
                    # If using 'FertilizationValue', rename it to 'FertilizerValue' for consistency
                    if 'FertilizationValue' in doc_data:
                        doc_data['FertilizerValue'] = doc_data.pop('FertilizationValue')
                    
                    fertilizer_data.append(doc_data)
                else:
                    print(f"Skipping doc due to missing 'FertilizerValue': {doc_data}")
            else:
                print(f"Skipping doc due to missing fields: {doc_data}")

        if not fertilizer_data:
            print("No valid data found in Firestore")

        return {'isSuccess': True, 'message': 'Fertilizer data fetched successfully.', 'data': fertilizer_data}

    except Exception as e:
        return {'isSuccess': False, 'message': f'Error fetching fertilizer data: {str(e)}'}
    

    
def get_irrigation_history():
    try:
        # Fetch irrigation data from Firebase Firestore
        irrigation_ref = db.collection('irrigation_results').order_by('PlantAge')
        docs = irrigation_ref.stream()

        # Process the data
        irrigation_data = []
        for doc in docs:
            doc_data = doc.to_dict()
            print(f"Fetched doc: {doc_data}")  # Log the data to check it

            # Check if necessary fields exist in the document
            if all(key in doc_data for key in ['PlantAge', 'SoilMoisture', 'IrrigationValue']):
                irrigation_data.append(doc_data)
            else:
                print(f"Skipping doc due to missing fields: {doc_data}")

        if not irrigation_data:
            print("No valid data found in Firestore")

        return {'isSuccess': True, 'message': 'Irrigation data fetched successfully.', 'data': irrigation_data}

    except Exception as e:
        return {'isSuccess': False, 'message': f'Error fetching irrigation data: {str(e)}'}
    