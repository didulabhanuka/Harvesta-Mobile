
import axios from "axios";

export const predictPest = async (image) => {
  const formData = new FormData();
  formData.append("image", {
    uri: image.uri,
    name: image.name,
    type: image.type,
  });
  // https://0226-2402-4000-2380-a01c-e4dd-a862-48a2-23f9.ngrok-free.app/harvesta-api/pestmanagement/pests
  const response = await fetch(
    "https://99b6-175-157-25-85.ngrok-free.app/harvesta-api/pestmanagement/pests",
    {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Error predicting pest:", error);
    throw new Error("Pest prediction failed");
  }

  return await response.json();
};

export const getPestHistory = async () => {
  try {
    const response = await axios.get(
      "https://99b6-175-157-25-85.ngrok-free.app/harvesta-api/pestmanagement/pests/history"
    );
    return response.data.history;
  } catch (error) {
    console.error("Error fetching pest history:", error);
    throw new Error("Failed to fetch pest history");
  }
};
