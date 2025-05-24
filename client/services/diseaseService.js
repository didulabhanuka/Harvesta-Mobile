// services/diseaseService.js

import axios from "axios";

// If you ever need to compute the host from Expo’s debuggerHost:
// const host = Constants.manifest.debuggerHost.split(':')[0]
// But if 192.168.1.113:5000 is correct, you’re good

const BASE_URL =
  "http://192.168.1.113:5000/harvesta-api/diseasepredict/predict";

export async function fetchDiseaseInfo(imageUri) {
  try {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });

    const resp = await axios.post(BASE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 15000,
    });

    // your Flask now returns:
    // {
    //   reportId,
    //   predicted_disease,
    //   predicted_severity,
    //   recommendations_by_day: { Day1:[…], Day3:[…], … },
    //   image_base64
    // }

    const {
      reportId,
      predicted_disease,
      predicted_severity,
      image_base64,
      recommendations_by_day,
    } = resp.data;

    return {
      reportId,
      predicted_disease,
      predicted_severity,
      image_base64,
      recommendationsByDay: recommendations_by_day || {},
    };
  } catch (err) {
    console.error("[diseaseService] fetchDiseaseInfo failed:", err.message);
    throw new Error("Unable to fetch disease information. Please try again.");
  }
}
