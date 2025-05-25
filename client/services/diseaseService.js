// /services/diseaseService.js

import axios from 'axios';

// IMPORTANT: Update your base URL when moving to production server
const BASE_URL = "http://172.20.10.3:5000/harvesta-api/diseasepredict";

export const fetchDiseaseInfo = async (imageUri) => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'photo.jpg',
  });

  try {
    const response = await axios.post(`${BASE_URL}/predict`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 15000,
    });

    const {
      reportId,
      predicted_disease,
      predicted_severity,
      image_base64,
      recommendations_by_day,
    } = response.data;

    return {
      reportId,
      predicted_disease,
      predicted_severity,
      image_base64,
      recommendationsByDay: recommendations_by_day || {},
    };
  } catch (error) {
    console.error('Error fetching disease info:', error.message);
    throw error;
  }
};

export const saveDayHistory = async (reportId, day, completedActions) => {
  try {
    const response = await axios.post(`${BASE_URL}/history`, {
      reportId,
      day,
      completedActions,
    });

    return response.data;
  } catch (error) {
    console.error('Error saving day history:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchAllReports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reports`);
    return response.data.reports || [];
  } catch (error) {
    console.error('Error fetching disease reports:', error.message);
    throw error;
  }
};

export const fetchReportById = async (reportId) => {
  try {
    const response = await axios.get(`${BASE_URL}/reports/${reportId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching report by ID (${reportId}):`, error.message);
    throw error;
  }
};

export const fetchReportHistoryById = async (reportId) => {
  try {
    const response = await axios.get(`${BASE_URL}/history/${reportId}`);
    return response.data.selected_actions || {};
  } catch (error) {
    console.error(`Error fetching report history for ID (${reportId}):`, error.message);
    throw error;
  }
};
