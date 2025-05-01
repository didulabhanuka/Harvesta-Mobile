import torch
import timm
import torchvision.transforms as transforms
from PIL import Image
import pandas as pd

# Initialize models
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class TomatoDiseaseClassifier(torch.nn.Module):
    def __init__(self, num_classes=10):  # Change this to 10
        super(TomatoDiseaseClassifier, self).__init__()
        self.base_model = timm.create_model('efficientnet_b0', pretrained=True)
        self.features = torch.nn.Sequential(*list(self.base_model.children())[:-1])
        self.classifier = torch.nn.Sequential(
            torch.nn.Flatten(),
            torch.nn.Linear(1280, num_classes)  # Output layer for disease classification
        )

    def forward(self, x):
        x = self.features(x)
        output = self.classifier(x)
        return output


# Define the Tomato Disease Severity Classifier
class TomatoDiseaseSeverityClassifier(torch.nn.Module):
    def __init__(self, num_classes=4):  # 4 classes for severity levels (Mild, Moderate, Severe, Healthy)
        super(TomatoDiseaseSeverityClassifier, self).__init__()
        self.base_model = timm.create_model('efficientnet_b0', pretrained=True)
        self.features = torch.nn.Sequential(*list(self.base_model.children())[:-1])
        self.classifier = torch.nn.Sequential(
            torch.nn.Flatten(),
            torch.nn.Linear(1280, num_classes)  # Output layer for severity classification
        )

    def forward(self, x):
        x = self.features(x)
        output = self.classifier(x)
        return output

# Initialize models
disease_model = TomatoDiseaseClassifier(num_classes=10)  # 10 disease types
severity_model = TomatoDiseaseSeverityClassifier(num_classes=4)  # 4 severity levels

# Load trained model weights
disease_model.load_state_dict(torch.load('apps/diseasepredict/models/my_all_model_torch.pth'))  # Adjust path if necessary
severity_model.load_state_dict(torch.load('apps/diseasepredict/models/my_model_torch.pth'))  # Adjust path if necessary

# Move models to device
disease_model.to(device)
severity_model.to(device)

disease_model.eval()  # Set models to evaluation mode
severity_model.eval()

# Define image transformation
transform = transforms.Compose([
    transforms.Resize((128, 128)),  # Resize image to 128x128 pixels
    transforms.ToTensor(),          # Convert image to tensor
])

# Load recommendation data for severity levels
df = pd.read_csv("apps/diseasepredict/models/Tomato_Bacterial_Spot_Recommendations.csv")  # Make sure the CSV file is in the right location

# Function to get disease severity recommendations
def get_recommendations(severity):
    if severity != 'Tomato_healthy':
        recommendations = df[df["Severity Level"] == severity]["Recommendations"].tolist()
        return recommendations
    return []

# Function to predict disease and severity
def predict_disease_and_severity(file):
    # Open and preprocess the image
    image = Image.open(file.stream).convert('RGB')
    image_tensor = transform(image).unsqueeze(0).to(device)  # Add batch dimension and move to device

    # Disease Prediction using the first model
    with torch.no_grad():
        disease_outputs = disease_model(image_tensor)
        _, predicted_disease = torch.max(disease_outputs, 1)

    # Define the class names for diseases
    disease_class_names = [ 'Tomato_Bacterial_spot', 'Tomato_Early_blight', 'Tomato_Late_blight', 'Tomato_Leaf_Mold',
                            'Tomato_Septoria_leaf_spot', 'Tomato_Spider_mites_Two_spotted_spider_mite', 'Tomato__Target_Spot',
                            'Tomato__Tomato_YellowLeaf__Curl_Virus', 'Tomato__Tomato_mosaic_virus', 'Tomato_healthy']
    predicted_disease_label = disease_class_names[predicted_disease.item()]

    # If disease is 'Bacterial Spot', run the severity model
    if predicted_disease_label == 'Tomato_Bacterial_spot':
        with torch.no_grad():
            severity_outputs = severity_model(image_tensor)
            _, predicted_severity = torch.max(severity_outputs, 1)

        # Define the class names for severity levels
        severity_class_names = ['Mild', 'Moderate', 'Severe', 'Healthy']
        predicted_severity_label = severity_class_names[predicted_severity.item()]

        # Get severity recommendations
        recommendations = get_recommendations(predicted_severity_label)
    else:
        predicted_severity_label = 'N/A'  # No severity prediction needed for other diseases
        recommendations = []

    return {
        'predicted_disease': predicted_disease_label,
        'predicted_severity': predicted_severity_label,
        'recommendations': recommendations
    }
