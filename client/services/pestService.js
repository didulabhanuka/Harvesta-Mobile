import axios from "axios";
import { BASE_URL } from "@env"; // This imports from .env

export const predictPest = async (image) => {
  const formData = new FormData();
  formData.append("image", {
    uri: image.uri,
    name: image.name,
    type: image.type,
  });

  const response = await fetch(`${BASE_URL}/pestmanagement/pests`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Error predicting pest:", error);
    throw new Error("Pest prediction failed");
  }

  return await response.json();
};

export const getPestHistory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pestmanagement/pests/history`);
    return response.data.history;
  } catch (error) {
    console.error("Error fetching pest history:", error);
    throw new Error("Failed to fetch pest history");
  }
};
