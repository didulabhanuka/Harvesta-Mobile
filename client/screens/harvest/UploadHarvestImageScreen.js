import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator, Alert, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadImages } from '../../services/harvestService';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function UploadHarvestImageScreen() {
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const images = result.assets.map((asset) => ({
        uri: asset.uri,
        type: 'image/jpeg',
        name: asset.fileName || `gallery_${Date.now()}.jpg`,
      }));
      setSelectedImages((prev) => [...prev, ...images]);
    }
  };

  const handleCaptureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
  
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera permission is required to capture images.');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled) {
      const image = {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: result.assets[0].fileName || `camera_${Date.now()}.jpg`,
      };
      setSelectedImages((prev) => [...prev, image]);
    }
  };
  

  const handleUpload = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No images', 'Please select or capture at least one image.');
      return;
    }

    setIsLoading(true);

    try {
      await uploadImages(selectedImages);
      navigation.replace('HarvestMain');
    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Upload Failed', 'Could not upload images.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImages([]);
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Lottie Animation */}
        <View style={styles.animationContainer}>
          <LottieView
            source={require('../../assets/jsons/harvest-upload.json')}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
        </View>

        {/* Instructions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instructions:</Text>
          <Text style={styles.infoText}>
            1. Capture or select harvest images.{'\n'}
            2. Make sure images are clear and focused.{'\n'}
            3. Remove unnecessary images before uploading.
          </Text>
        </View>

        {/* Image Preview List */}
        {selectedImages.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {selectedImages.map((img, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: img.uri }} style={styles.previewImage} />
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
                  <Ionicons name="close" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={handleCaptureImage}>
            <Ionicons name="camera" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Capture</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handlePickImage}>
            <Ionicons name="images" size={20} color="#fff" style={styles.icon} />
            <Text style={styles.buttonText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Upload & Clear */}
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Ionicons name="cloud-upload" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Upload & Predict</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Ionicons name="trash" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}>Clear Images</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Uploading...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingBottom: 50 },
  scrollContainer: { padding: 20, alignItems: 'center' },
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    flex: 0.48,
    backgroundColor: '#40B59F',
    borderRadius: 10,
    paddingVertical: 14,
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
    marginBottom: 15,
  },
  clearButton: {
    backgroundColor: '#E53935',
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
  imageScroll: { marginBottom: 20, width: '100%' },
  imageContainer: {
    marginRight: 10,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#E53935',
    borderRadius: 10,
    padding: 2,
  },
});
