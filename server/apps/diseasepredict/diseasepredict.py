import os
import torch
import timm
import torchvision.transforms as transforms
from PIL import Image
from datetime import datetime
import pandas as pd
from werkzeug.utils import secure_filename
from io import BytesIO
import base64

# Firebase config
from apps.firebase_config import initialize_firebase
db = initialize_firebase()  # Initialize Firebase Firestore

# Initialize models (disease classification and severity)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define disease classification model
class TomatoDiseaseClassifier(torch.nn.Module):
    def __init__(self, num_classes=10):
        super(TomatoDiseaseClassifier, self).__init__()
        self.base_model = timm.create_model('efficientnet_b0', pretrained=True)
        self.features = torch.nn.Sequential(*list(self.base_model.children())[:-1])
        self.classifier = torch.nn.Sequential(
            torch.nn.Flatten(),
            torch.nn.Linear(1280, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        output = self.classifier(x)
        return output


# Define severity classification model
class TomatoDiseaseSeverityClassifier(torch.nn.Module):
    def __init__(self, num_classes=4):
        super(TomatoDiseaseSeverityClassifier, self).__init__()
        self.base_model = timm.create_model('efficientnet_b0', pretrained=True)
        self.features = torch.nn.Sequential(*list(self.base_model.children())[:-1])
        self.classifier = torch.nn.Sequential(
            torch.nn.Flatten(),
            torch.nn.Linear(1280, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        output = self.classifier(x)
        return output


# Load models
disease_model = TomatoDiseaseClassifier(num_classes=10)
severity_model = TomatoDiseaseSeverityClassifier(num_classes=4)

disease_model.load_state_dict(torch.load('apps/diseasepredict/models/my_all_model_torch.pth'))
severity_model.load_state_dict(torch.load('apps/diseasepredict/models/my_model_torch.pth'))

disease_model.to(device)
severity_model.to(device)
disease_model.eval()
severity_model.eval()

# Image transformation for prediction
transform = transforms.Compose([
    transforms.Resize((128, 128)),
    transforms.ToTensor(),
])

# Load recommendations
df = pd.read_csv("apps/diseasepredict/models/Tomato_Bacterial_Spot_Recommendations.csv")


def get_recommendations(severity):
    if severity != 'Tomato_healthy':
        recommendations = df[df["Severity Level"] == severity]["Recommendations"].tolist()
        return recommendations
    return []


def convert_image_to_base64(image):
    """Converts image to base64 string."""
    byte_io = BytesIO()
    image.save(byte_io, format="JPEG")
    byte_data = byte_io.getvalue()
    base64_string = base64.b64encode(byte_data).decode('utf-8')  # Convert byte data to base64 string
    return base64_string


def save_image_to_firestore(image_base64):
    """Saves image base64 string to Firestore."""
    try:
        data = {
            "image_base64": image_base64,  # Store the base64 string of the image
            "timestamp": datetime.utcnow().isoformat()
        }
        
        # Save to Firestore collection 'images'
        db.collection("images").add(data)
        print(f"Saved image to Firestore.")
    except Exception as e:
        print(f"Error saving image to Firestore: {e}")


def save_disease_prediction_to_firestore(predicted_disease, predicted_severity, recommendations, image_base64):
    """Save the disease prediction data to Firestore."""
    try:
        data = {
            "predicted_disease": predicted_disease,
            "predicted_severity": predicted_severity,
            "recommendations": recommendations,
            "timestamp": datetime.utcnow().isoformat(),
            "image_base64": image_base64  # Store the image base64 in Firestore
        }

        db.collection("disease_reports").add(data)
        print(f"Saved disease prediction to Firestore: {data}")

    except Exception as e:
        print(f"Error saving disease prediction data: {e}")


def predict_disease_and_severity(file):
    """Handle disease prediction and severity analysis."""
    image = Image.open(file.stream).convert("RGB")

    # Convert the image to base64 string
    image_base64 = convert_image_to_base64(image)

    # Save the base64 string to Firestore
    save_image_to_firestore(image_base64)

    # Disease prediction
    image_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        disease_outputs = disease_model(image_tensor)
        _, predicted_disease = torch.max(disease_outputs, 1)

    disease_class_names = [
        'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight', 'Tomato_Leaf_Mold',
        'Tomato_Septoria_leaf_spot', 'Tomato_Spider_mites_Two_spotted_spider_mite', 'Tomato__Target_Spot',
        'Tomato__Tomato_YellowLeaf__Curl_Virus', 'Tomato__Tomato_mosaic_virus', 'Tomato_healthy'
    ]
    predicted_disease_label = disease_class_names[predicted_disease.item()]

    # Severity prediction if disease is 'Bacterial Spot'
    predicted_severity_label = 'N/A'
    recommendations = []

    if predicted_disease_label == 'Tomato_Bacterial_spot':
        with torch.no_grad():
            severity_outputs = severity_model(image_tensor)
            _, predicted_severity = torch.max(severity_outputs, 1)

        severity_class_names = ['Mild', 'Moderate', 'Severe', 'Healthy']
        predicted_severity_label = severity_class_names[predicted_severity.item()]
        recommendations = get_recommendations(predicted_severity_label)

    # Save the disease prediction data to Firestore
    save_disease_prediction_to_firestore(predicted_disease_label, predicted_severity_label, recommendations, image_base64)

    return {
        "predicted_disease": predicted_disease_label,
        "predicted_severity": predicted_severity_label,
        "recommendations": recommendations,
        "image_base64": image_base64  # Return the base64 string as part of the response
    }
