// screens/ImageUploadScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// simulate an upload (replace with your real upload)
const uploadImage = async (uri) => {
  return new Promise((resolve) => setTimeout(() => resolve('Uploaded!'), 3000));
};

export default function ImageUploadScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image first.');
      return;
    }
    setIsLoading(true);
    try {
      await uploadImage(image);
      navigation.navigate('DiseaseInfo', { imageUri: image });
    } catch (e) {
      Alert.alert('Upload Failed', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Lottie Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/jsons/harvest-upload.json')} // Replace with your own animation if needed
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
        </View>

        {/* Instructions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <Text style={styles.infoText}>
            1. Select an image from your gallery.{'\n'}
            2. Make sure the image is clear and focused.{'\n'}
            3. Remove the image to select a different one before uploading.
          </Text>
        </View>

        {/* Image Preview */}
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeButton} onPress={handleRemoveImage}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.noImageText}>No image selected</Text>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Ionicons name="images" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Pick from Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Upload Button */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Ionicons name="cloud-upload" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Upload & Analyze</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff'  },
  scrollContainer: { padding: 20, alignItems: 'center', paddingBottom: 100 },
  animationContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#40B59F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  infoText: { fontSize: 14, color: '#555', textAlign: 'left' },

  imageContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  previewImage: {
    width: screenWidth - 300,
    height: 100,
    borderRadius: 16,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E53935',
    borderRadius: 10,
    padding: 4,
  },
  noImageText: {
    fontSize: 18,
    color: '#888',
    alignSelf: 'center',
    marginBottom: 20,
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#40B59F',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#40B59F',
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  icon: { marginRight: 8 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(64, 181, 159, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
