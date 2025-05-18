import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // For the loading spinner animation

const { width: screenWidth } = Dimensions.get('window');

// Simulated upload function for demonstration
const uploadImage = async (imageUri) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('Image uploaded successfully!');
    }, 3000);
  });
};

export default function ImageUploadScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Handle image upload
  const handleUpload = async () => {
    if (image) {
      setLoading(true);
      await uploadImage(image);
      setLoading(false);
      navigation.navigate('DiseaseInfo', { imageUri: image });
    } else {
      Alert.alert('No Image Selected', 'Please select an image before uploading.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Image</Text>

      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No image selected</Text>
      )}

      {/* Pick Image Button */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick Image from Gallery</Text>
      </TouchableOpacity>

      {/* Activity Indicator or Upload Button */}
      {loading ? (
        <LottieView
          source={require('../../assets/jsons/loading.json')} // Make sure this file exists
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleUpload}>
          <Text style={styles.buttonText}>Upload Image</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  image: {
    width: screenWidth - 40,
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  noImageText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#40B59F',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
});
