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
import { Ionicons } from '@expo/vector-icons';

export default function DiseaseDetectionScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Select Your Action</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.card, styles.scan]}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <Ionicons name="camera-outline" size={36} color="#40B59F" style={styles.icon} />
          <Text style={styles.label}>Scan Plant Disease</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.upload]}
          onPress={() => navigation.navigate('ImageUploadScreen')}
        >
          <Ionicons name="cloud-upload-outline" size={36} color="#40B59F" style={styles.icon} />
          <Text style={styles.label}>Upload Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, styles.history]}
          onPress={() => navigation.navigate('DiseaseHistoryScreen')}
        >
          <Ionicons name="time-outline" size={36} color="#40B59F" style={styles.icon} />
          <Text style={styles.label}>View Plant History</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F7',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center'
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
  },
  buttons: {
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 30,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flexShrink: 1,
  },
  scan: {
    borderLeftWidth: 6,
    borderLeftColor: '#40B59F',
  },
  upload: {
    borderLeftWidth: 6,
    borderLeftColor: '#40B59F',
  },
  history: {
    borderLeftWidth: 6,
    borderLeftColor: '#40B59F',
  },
});
