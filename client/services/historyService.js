// services/historyService.js
import axios from 'axios';

export async function saveDayHistory(reportId, day, completedActions) {
  try {
    const response = await axios.post('http://192.168.1.113:5000/harvesta-api/diseasepredict/history', {
      reportId,
      day,
      completedActions,
    });
    console.log('saveDayHistory response:', response.data);
    return response.data;
  } catch (error) {
    console.error('saveDayHistory error:', error.response?.data || error.message);
    throw error;
  }
}
