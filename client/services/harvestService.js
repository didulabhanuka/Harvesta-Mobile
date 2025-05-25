import axios from 'axios';
import { BASE_URL } from "@env"; // This imports from .env

export const uploadImages = async (images) => {
  const formData = new FormData();

  images.forEach((image, index) => {
    formData.append('files', {
      uri: image.uri,
      type: image.type || 'image/jpeg',
      name: image.name || `image_${index}.jpg`,
    });
  });

  try {
    const response = await axios.post(`${BASE_URL}/harvestingpredict/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error.message);
    throw error;
  }
};

export const fetchHistoricalData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/harvestingpredict/historical-data`);
    return response.data.historical_data; 
    // server returns { "historical_data": [...] }
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    throw error;
  }
};

export const fetchLatestData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/harvestingpredict/latest-data`);
    return response.data.latest_data; 
    // server returns { "latest_data": {...} }
  } catch (error) {
    console.error('Error fetching latest prediction data:', error.message);
    throw error;
  }
};
