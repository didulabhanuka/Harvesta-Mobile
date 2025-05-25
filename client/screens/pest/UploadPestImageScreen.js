import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { predictPest } from "../../services/pestService";

const { width: screenWidth } = Dimensions.get("window");

export default function UploadPestImageScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImagePick = async (source) => {
    const permission = await (source === "camera"
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync());

    if (permission.status !== "granted") {
      Alert.alert("Permission Denied", `Allow access to ${source}.`);
      return;
    }

    const result = await (source === "camera"
      ? ImagePicker.launchCameraAsync({
          quality: 1,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        })
      : ImagePicker.launchImageLibraryAsync({
          quality: 1,
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        }));

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({
        uri: asset.uri,
        type: "image/jpeg",
        name: asset.fileName || `${source}_${Date.now()}.jpg`,
      });
    }
  };

  const handlePredict = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select or capture an image.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await predictPest(image);
      navigation.navigate("PestResult", { result });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Pest prediction failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Lottie Animation */}
        <LottieView
          source={require("../../assets/jsons/pest-upload.json")}
          autoPlay
          loop
          style={{ width: 220, height: 220 }}
        />

        {/* Instructions Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <Text style={styles.infoText}>
            1. Capture or select clear pest-affected crop images.{"\n"}
            2. Make sure the image is clear and focused.{"\n"}
            3. Remove the image if it’s not suitable before detection.
          </Text>
        </View>

        {/* Preview with Remove Button */}
        {image && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePick("camera")}
          >
            <Ionicons name="camera" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePick("gallery")}
          >
            <Ionicons name="images" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Predict Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handlePredict}>
          <Ionicons name="search" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Detect Pest</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Detecting...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 50,
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: "100%",
    shadowColor: "#40B59F",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    textAlign: "left",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  button: {
    flex: 0.48,
    backgroundColor: "#40B59F",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    backgroundColor: "#40B59F",
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(64, 181, 159, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    marginBottom: 20,
    position: "relative",
  },
  previewImage: {
    width: screenWidth * 0.75,
    height: screenWidth * 0.75,
    borderRadius: 12,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  removeButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#E53935",
    borderRadius: 10,
    padding: 2,
  },
});
