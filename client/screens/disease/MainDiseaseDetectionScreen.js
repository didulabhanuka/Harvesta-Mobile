// screens/disease/DiseaseDetectionScreen.js

import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function DiseaseDetectionScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Action</Text>
      <Text style={styles.subtitle}>Your plant’s health is just a tap away.</Text>

      {/* Upload Image Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ImageUploadScreen')}
      >
        <Icon name="cloud-upload" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      {/* View Plant History Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('DiseaseHistoryScreen')}
      >
        <Icon name="history" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>View Plant History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#00796b',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#40B59F',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'Poppins',
  },
  buttonIcon: {
    marginRight: 10,
  },
});
