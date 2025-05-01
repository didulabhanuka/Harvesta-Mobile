import cv2 as cv
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import os

# Firebase Initialization (Only initialize once)
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("harvesta-24-25j-250-firebase-adminsdk.json")
        firebase_admin.initialize_app(cred)
        print("Firebase initialized successfully")
    except Exception as e:
        print(f"Error initializing Firebase: {e}")

# Firestore client
db = firestore.client()

# Load Pest Detection Model
model = tf.keras.models.load_model('apps/pestmanagement/artifacts/pests.h5')

model.compile(
    optimizer='Adam',
    loss='categorical_crossentropy',
    metrics=[
        tf.keras.metrics.CategoricalAccuracy(name='accuracy'),
        tf.keras.metrics.Precision(name='precision'),
        tf.keras.metrics.Recall(name='recall'),
        tf.keras.metrics.AUC(name='auc')
    ]
)

def preprocessing_function(img):
    return tf.keras.applications.xception.preprocess_input(img)

def get_remedies(pest):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    remedies_path = os.path.join(base_dir, '..', 'pestmanagement', 'data', 'pest management.xlsx')

    if not os.path.exists(remedies_path):
        return {"error": "Remedies file not found", "file_path": remedies_path}

    try:
        df = pd.read_excel(remedies_path, engine='openpyxl')
        df.dropna(how='all', inplace=True)

        if 'Pests' not in df.columns:
            return {"error": "Invalid file format - 'Pests' column missing"}

        df['Pests'].fillna(method='ffill', inplace=True)
        df['Pests'] = df['Pests'].astype(str).str.lower().str.strip()

        pest_data = df[df['Pests'] == pest.lower().strip()]

        if 'Harms' not in df.columns or 'Solution' not in df.columns:
            return {"error": "Invalid file format - Required columns missing"}

        return {
            "pest": pest,
            "harms": pest_data['Harms'].dropna().tolist(),
            "remedies": pest_data['Solution'].dropna().tolist()
        }

    except Exception as e:
        print(f"Error reading remedies file: {str(e)}")
        return {"error": f"Failed to read Excel file: {str(e)}"}

def save_pest_detection_to_firebase(pest_name, probability, image_path):
    try:
        data = {
            "pest_name": pest_name,
            "probability": probability,
            "image_path": image_path.replace("\\", "/"),  # Fix path separators
            "timestamp": datetime.utcnow().isoformat()
        }
        db.collection("pest_detections").add(data)
        print(f"Saved pest detection to Firebase: {data}")

    except Exception as e:
        print(f"Error saving pest detection to Firebase: {e}")

def get_pest_detection_history():
    try:
        pest_detections_ref = db.collection("pest_detections")
        pest_detections = pest_detections_ref.stream()

        history = []
        for pest in pest_detections:
            pest_data = pest.to_dict()
            print(f"Fetched pest data: {pest_data}")  # Log the fetched data
            # Only append necessary fields: pest_name, image_path, and timestamp
            history.append({
                "pest_name": pest_data.get("pest_name", ""),
                "image_path": pest_data.get("image_path", ""),
                "timestamp": pest_data.get("timestamp", "")
            })

        return history

    except Exception as e:
        print(f"Error fetching pest detection history: {str(e)}")
        return {"error": f"Failed to fetch pest detection history: {str(e)}"}

# Add this function for pest detection
def inference_pests(image_path):
    """
    Detects the pest from an image and returns pest name, probability, harms, and remedies.
    """
    pest_dict = {
        0: 'aphids', 1: 'mites', 2: 'weevil', 3: 'whiteflies'
    }

    try:
        # Read and preprocess image
        image = cv.imread(image_path)
        if image is None:
            raise ValueError("Error loading image from path.")
        
        image = cv.cvtColor(image, cv.COLOR_BGR2RGB)
        image = cv.resize(image, (299, 299))  # Resize to match model input size
        image = np.expand_dims(image, axis=0)  # Add batch dimension
        image = preprocessing_function(image)

        # Make prediction
        prediction = model.predict(image)
        prob = f"{np.max(prediction) * 100:.2f} %"  # Get the highest prediction probability
        label = pest_dict[np.argmax(prediction)]  # Get the corresponding pest label
        
        # Get remedies for the detected pest
        remedies = get_remedies(label)
        remedies["probability"] = prob  # Add probability to remedies response

        # Save the pest detection result to Firebase
        save_pest_detection_to_firebase(label, prob, image_path)
        
        return remedies

    except Exception as e:
        print(f"Error during pest detection: {str(e)}")
        return {"error": f"Failed to detect pest: {str(e)}"}
