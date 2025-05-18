import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { CachedImage } from 'react-native-expo-cached-image'; // For cached network image

const DiseaseHistoryScreen = () => {
  const [diagnosisHistory, setDiagnosisHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDiagnosisHistory = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, 'disease_reports'));
        const fetchedData = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          const date = data.timestamp?.toDate().toISOString().split('T')[0] || 'Unknown';
          return {
            id: doc.id,
            disease: data.disease || 'Unknown',
            severity: data.stage || 'Unknown',
            image: data.image_url,
            detectedDate: date,
          };
        });
        setDiagnosisHistory(fetchedData);
      } catch (error) {
        console.error('Error fetching diagnosis history: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiagnosisHistory();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DiseaseDetailScreen', { documentId: item.id })}
    >
      <Image
        source={item.image ? { uri: item.image } : require('../../assets/icon.png')}
        style={styles.image}
      />
      <View style={styles.cardContent}>
        <Text style={styles.diseaseText}>Disease: {item.disease}</Text>
        <Text
          style={[
            styles.severityText,
            item.severity === 'Severe'
              ? styles.severe
              : item.severity === 'Moderate'
              ? styles.moderate
              : styles.mild,
          ]}
        >
          Severity: {item.severity}
        </Text>
        <Text style={styles.dateText}>Detected Date: {item.detectedDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disease Diagnosis History</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#40B59F" />
      ) : (
        <FlatList
          data={diagnosisHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
  },
  diseaseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  severe: {
    color: '#FF4C4C',
  },
  moderate: {
    color: '#FFA500',
  },
  mild: {
    color: '#4CAF50',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
});

export default DiseaseHistoryScreen;
