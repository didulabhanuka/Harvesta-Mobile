
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
transform = transforms.Compose([transforms.Resize((128, 128)), transforms.ToTensor()])

# Load recommendations from a CSV file
df = pd.read_csv("apps/diseasepredict/models/Tomato_Bacterial_Spot_Recommendations.csv")



def get_recs_by_day(severity_label: str) -> dict:
    filtered = df[df["Severity Level"] == severity_label]
    grouped  = filtered.groupby("Time (Days)")["Recommendations"].apply(list).to_dict()
    out = {}
    for day_str, recs in grouped.items():
        n = int(day_str.split()[-1])  # “Day 1” → 1
        out[f"Day{n}"] = recs
    return out


def get_recommendations(severity_label):
    # only pull if it’s not the “Healthy” case
    if severity_label != "Healthy":
        return (
            df[df["Severity Level"] == severity_label]
              ["Recommendations"]
              .tolist()
        )
    return []

def convert_image_to_base64(img: Image.Image) -> str:
    buf = BytesIO(); img.save(buf, format="JPEG")
    return base64.b64encode(buf.getvalue()).decode('utf-8')

    
def update_selected_actions(report_id: str, day: int, actions: list):
    """This function updates the selected actions in Firestore for the specific report ID and day."""
    # writes { selected_actions.DayX: [..] } into the same doc
    field = f"selected_actions.Day{day}"
    db.collection("disease_reports").document(report_id).update({field: actions})


        
#after scan image save data in firestore
def save_disease_prediction_to_firestore(predicted_disease, predicted_severity, recommendations, image_base64):
    """Save the disease prediction data to Firestore and return the reportId."""
    try:
        data = {
            "predicted_disease": predicted_disease,
            "predicted_severity": predicted_severity,
            "recommendations": recommendations,
            "timestamp": datetime.utcnow().isoformat(),
            "image_base64": image_base64,
            "selected_actions": {},
        }

        _, doc_ref = db.collection("disease_reports").add(data)
        report_id = doc_ref.id

        print(f"Saved disease prediction to Firestore with reportId: {report_id}")
        return report_id

    except Exception as e:
        print(f"Error saving to Firestore: {e}")
        return None


def predict_disease_and_severity(file_stream) -> dict:
    img      = Image.open(file_stream).convert("RGB")
    img_b64  = convert_image_to_base64(img)

    # predict
    t = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        out = disease_model(t)
        _, di = out.max(1)
    labels = [
      'Tomato_Bacterial_spot','Tomato_Early_blight','Tomato_Late_blight',
      'Tomato_Leaf_Mold','Tomato_Septoria_leaf_spot',
      'Tomato_Spider_mites_Two_spotted_spider_mite',
      'Tomato__Target_Spot','Tomato__Tomato_YellowLeaf__Curl_Virus',
      'Tomato__Tomato_mosaic_virus','Tomato_healthy'
    ]
    pred_dis = labels[di.item()]

    # severity & per‐day recs
    pred_sev = "N/A"
    recs_by_day = {}
    if pred_dis == 'Tomato_Bacterial_spot':
        with torch.no_grad():
            out2 = severity_model(t)
            _, si = out2.max(1)
        sev_labels = ['Mild','Moderate','Severe','Healthy']
        pred_sev = sev_labels[si.item()]
        recs_by_day = get_recs_by_day(pred_sev)

    # save & return
    report_id = save_disease_prediction_to_firestore(pred_dis, pred_sev, recs_by_day, img_b64)
    return {
      "reportId": report_id,
      "predicted_disease": pred_dis,
      "predicted_severity": pred_sev,
      "recommendations_by_day": recs_by_day,
      "image_base64": img_b64
    }


def list_reports():
    """Return basic info for all saved reports."""
    try:
        reports = []
        for doc in db.collection("disease_reports").stream():
            data = doc.to_dict() or {}
            img_b64 = data.get("image_base64", "")
            # take a small thumbnail (first 100 chars) to keep payload light
            thumb = img_b64[:100] if img_b64 else ""
            reports.append({
                "reportId":         doc.id,
                "predicted_disease":   data.get("predicted_disease"),
                "predicted_severity":  data.get("predicted_severity"),
                "timestamp":           data.get("timestamp"),
                "image_thumb":         thumb
            })
        return jsonify({"reports": reports}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
