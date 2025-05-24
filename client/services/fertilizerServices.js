import axios from 'axios';

// Function to fetch Fertilizer Value from the API
export const fetchFertilizerValue = async (soilN, soilP, soilK, plantAge, fertilizerType) => {
  try {
    const response = await axios.post('http://172.20.10.3:5000/harvesta-api/fertilizermanagement/fertilization', {
      SoilN: parseInt(soilN) || 0,
      SoilP: parseInt(soilP) || 0,
      SoilK: parseInt(soilK) || 0,
      PlantAge: parseInt(plantAge) || 0,
      FertilizerType: fertilizerType,
    });
    
    console.log('API Response:', response.data); // Log the full response

    if (response.status === 200 && response.data.value && response.data.value.FertilizationValue) {
      return response.data.value.FertilizationValue;  // Correct access to the nested value
    } else {
      console.error('No FertilizationValue found in the response');
      return null;
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return null;
  }
};

// Function to fetch Fertilizer History from the API
export const fetchFertilizerHistory = async () => {
  try {
    const response = await axios.get('http://172.20.10.3:5000/harvesta-api/fertilizermanagement/fertilizer-history');

    if (response.status === 200 && response.data.isSuccess && response.data.data) {
      console.log('Fetched data:', response.data);
      return response.data.data;  // Return the data from the response
    } else {
      throw new Error('Failed to load fertilizer history or no data available');
    }
  } catch (error) {
    console.error('Error fetching fertilizer history:', error.message);
    throw error;
  }
};

// Function to fetch Irrigation Value from the API
export const fetchIrrigationValue = async (plantAge, soilMoisture) => {
  try {
    const response = await axios.post('http://172.20.10.3:5000/harvesta-api/fertilizermanagement/irrigation', {
      PlantAge: parseInt(plantAge) || 0,
      SoilMoisture: parseInt(soilMoisture) || 0,
    });

    console.log('API Response:', response.data); // Log the full response

    if (response.status === 200 && response.data.value && response.data.value.IrrigationValue) {
      return response.data.value.IrrigationValue;  // Correct access to the nested value
    } else {
      console.error('No IrrigationValue found in the response');
      return null;
    }
  } catch (error) {
    console.error('API Error:', error.message);
    return null;
  }
};

// Function to fetch Irrigation History from the API
export const fetchIrrigationHistory = async () => {
  try {
    const response = await axios.get('http://172.20.10.3:5000/harvesta-api/fertilizermanagement/irrigation-history');

    if (response.status === 200 && response.data.isSuccess && response.data.data) {
      console.log('Fetched data:', response.data);
      return response.data.data;  // Return the data from the response
    } else {
      throw new Error('Failed to load irrigation history or no data available');
    }
  } catch (error) {
    console.error('Error fetching irrigation history:', error.message);
    throw error;
  }
};
