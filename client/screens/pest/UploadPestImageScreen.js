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

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Pest Image</Text>
      </View> */}

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <LottieView
          source={require("../../assets/jsons/pest-upload.json")}
          autoPlay
          loop
          style={{ width: 220, height: 220 }}
        />

        <Text style={styles.instructionText}>
          Upload or capture a crop image to detect pests.
        </Text>

        {image && (
          <Image source={{ uri: image.uri }} style={styles.previewImage} />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePick("camera")}
          >
            <Ionicons
              name="camera"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePick("gallery")}
          >
            <Ionicons
              name="images"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handlePredict}>
          <Ionicons name="search" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Detect Pest</Text>
        </TouchableOpacity>
      </ScrollView>

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
  header: {
    backgroundColor: "#40B59F",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 40,
  },
  instructionText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  previewImage: {
    width: screenWidth * 0.75,
    height: screenWidth * 0.75,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
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
});
