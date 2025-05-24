// screens/ImageUploadScreen.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // loading animation

const { width: screenWidth } = Dimensions.get('window');

// simulate an upload (replace with your real upload)
const uploadImage = async (uri) => {
  return new Promise(resolve => setTimeout(() => resolve('Uploaded!'), 3000));
};

export default function ImageUploadScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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
      return Alert.alert('No Image Selected', 'Please select an image first.');
    }
    setLoading(true);
    try {
      await uploadImage(image);
      navigation.navigate('DiseaseInfo', { imageUri: image });
    } catch (e) {
      Alert.alert('Upload Failed', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Image</Text>

      {image
        ? <Image source={{ uri: image }} style={styles.image} />
        : <Text style={styles.noImage}>No image selected</Text>
      }

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick from Gallery</Text>
      </TouchableOpacity>

      {loading
        ? <LottieView source={require('../../assets/jsons/loading.json')} autoPlay loop style={styles.loader} />
        : <TouchableOpacity style={styles.button} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload & Analyze</Text>
          </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 20,
  },
  image: {
    width: screenWidth - 40,
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
  },
  noImage: {
    fontSize: 18,
    color: '#888',
    alignSelf: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#40B59F',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
});
