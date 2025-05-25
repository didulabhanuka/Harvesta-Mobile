// screens/disease/HistoryListScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchAllReports } from '../../services/diseaseService';

export default function HistoryListScreen({ navigation }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllReports()
      .then(data => setReports(data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#40B59F" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('HistoryDetail', { reportId: item.reportId })}
    >
      {item.image_base64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }}
          style={styles.thumb}
        />
      ) : (
        <Ionicons name="image-outline" size={60} color="#ccc" style={styles.thumb} />
      )}
      <View style={styles.info}>
        <Text style={styles.disease}>{item.predicted_disease}</Text>
        <Text style={styles.date}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <View style={[
        styles.badge,
        { backgroundColor: item.predicted_severity === 'Severe' ? '#FF4C4C' : '#40B59F' }
      ]}>
        <Text style={styles.badgeText}>{item.predicted_severity}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Diagnosis History</Text>
      <FlatList
        data={reports}
        keyExtractor={r => r.reportId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No history yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F9', marginTop: 50 },
  headerTitle: {
    fontSize: 28, fontWeight: '700', color: '#333',
    marginTop: 16, marginHorizontal: 16, marginBottom: 8,
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 16 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 12, marginBottom: 12, borderRadius: 8,
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 2,
  },
  thumb: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  disease: { fontSize: 16, fontWeight: '600', color: '#333' },
  date: { fontSize: 12, color: '#666', marginTop: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '500' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#666' }
});
