import axios from 'axios';

// Define the API endpoint (replace with your actual base URL)
const BASE_URL = 'http://192.168.8.100:5000/harvesta-api/diseasepredict/predict'; // Replace with your backend URL

// Function to upload the image and fetch disease info from the backend
export const fetchDiseaseInfo = async (imageUri) => {
  try {
    // Prepare form data
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    // Send the image to the backend
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Handle the response from the backend
    const diseaseInfo = response.data;

    // Return the disease information and base64 image
    return {
      predicted_disease: diseaseInfo.predicted_disease,
      predicted_severity: diseaseInfo.predicted_severity,
      image_base64: diseaseInfo.image_base64, // Base64 image
      recommendations: diseaseInfo.recommendations,
    };
  } catch (error) {
    console.error('Error fetching disease info:', error);
    throw error;  // Throw error to be handled by calling component
  }
};
