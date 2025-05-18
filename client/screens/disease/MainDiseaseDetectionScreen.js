import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function DiseaseDetectionScreen() {
  const navigation = useNavigation();

  // Handle navigation on button press
  // const handleScanDisease = () => {
  //   navigation.navigate('CameraScreen');
  // };

  const handleUploadImage = () => {
    navigation.navigate('ImageUploadScreen');
  };

  const handleViewHistory = () => {
   navigation.navigate('DiseaseHistoryScreen');
  };

  return (
    <View style={styles.container}>
      {/* Logo/Image */}
      {/* <Image
        source={require('../assets/images/disease_identify.png')}
        style={styles.logo}
      /> */}
      <Text style={styles.title}>Select Your Action</Text>

      {/* Scan Disease Button */}
      <TouchableOpacity
        style={[styles.button, styles.scanButton]}
        // onPress={handleScanDisease}
      >
        <Image
          source={require('../../assets/jsons/scan_animation.json')}
          style={styles.buttonImage}
        />
        <Text style={styles.buttonText}>Scan Plant Disease</Text>
      </TouchableOpacity>

      {/* Upload Image Button */}
      <TouchableOpacity
        style={[styles.button, styles.uploadButton]}
        onPress={handleUploadImage}
      >
        <Image
          source={require('../../assets/jsons/upload_animation.json')}
          style={styles.buttonImage}
        />
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {/* View Plant History Button */}
      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={handleViewHistory}
      >
        <Image
          source={require('../../assets/jsons/history_animation.json')}
          style={styles.buttonImage}
        />
        <Text style={styles.buttonText}>View Plant History</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4d4c4a',
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginBottom: 20,
    width: '100%',
  },
  buttonImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4d4c4a',
  },
  scanButton: {
    backgroundColor: '#a3f3b3',
  },
  uploadButton: {
    backgroundColor: '#a3c8f3',
  },
  historyButton: {
    backgroundColor: '#f3b4a3',
  },
});
