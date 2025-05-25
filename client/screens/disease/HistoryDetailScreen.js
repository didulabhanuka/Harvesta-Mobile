import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  Pressable,
  StyleSheet
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchReportById, fetchReportHistoryById } from '../../services/diseaseService';

export default function HistoryDetailScreen({ route, navigation }) {
  const { reportId } = route.params;
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState({});

  // Function to load report details and history from backend
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [rRes, hRes] = await Promise.all([
        fetchReportById(reportId),
        fetchReportHistoryById(reportId)   // <-- UNCOMMENTED to fetch history
      ]);
      setReport(rRes);
      setHistory(hRes || {});  // hRes is already the selected_actions object
    } catch (e) {
      console.error('Error loading report or history:', e);
      setReport(null);
      setHistory({});
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Reload data whenever screen comes into focus
  useFocusEffect(useCallback(() => {
    loadData();
  }, [loadData]));

  // Navigate to ActionSchedule with the needed params
  const viewActionPlan = useCallback(async () => {
    if (!report) return;

    const byDay = report.recommendations_by_day || report.recommendations || {};
    if (Object.keys(byDay).length === 0) return;

    const json = await AsyncStorage.getItem('dayOffsets');
    const DEFAULT_OFFSETS = [1, 3, 5];
    const offsets = json ? JSON.parse(json) : DEFAULT_OFFSETS;

    navigation.navigate('ActionSchedule', {
      recordId: report.reportId || reportId,
      recommendationsByDay: byDay,
      dayOffsets: offsets,
    });
  }, [navigation, report, reportId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#40B59F" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Report not found.</Text>
      </View>
    );
  }

  const perDay = report.recommendations_by_day || report.recommendations || {};

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {report.image_base64 && (
        <Image
          source={{ uri: `data:image/jpeg;base64,${report.image_base64}` }}
          style={styles.image}
        />
      )}

      <Text style={styles.title}>{report.predicted_disease}</Text>

      <View
        style={[
          styles.badge,
          report.predicted_severity === 'Severe' ? styles.badgeSevere : styles.badgeMild
        ]}
      >
        <Text style={styles.badgeText}>{report.predicted_severity}</Text>
      </View>

      <Text style={styles.date}>Diagnosed: {new Date(report.timestamp).toLocaleString()}</Text>

      {Object.entries(perDay).map(([day]) => (
        <View key={day} style={styles.dayCard}>
          <Text style={styles.dayHeader}>{day}</Text>
          {history[day]?.length > 0 ? (
            history[day].map((act, idx) => (
              <Text key={idx} style={styles.userText}>• {act}</Text>
            ))
          ) : (
            <Text style={styles.noActionText}>No actions recorded for {day}.</Text>
          )}
        </View>
      ))}

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
          onPress={viewActionPlan}
        >
          <Text style={styles.primaryText}>View Action Plan</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate('ReminderSettings')}
        >
          <Text style={styles.secondaryText}>Customize Reminders</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F4F8'
  },
  errorText: { color: '#FF4C4C', fontSize: 16, fontWeight: '600' },

  container: { flex: 1, backgroundColor: '#F0F4F8' },
  content: { padding: 20, paddingBottom: 60 },

  image: {
    width: '100%', height: 220, borderRadius: 12, marginBottom: 16, backgroundColor: '#ddd'
  },
  title: { fontSize: 26, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 8 },

  badge: {
    alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 12
  },
  badgeSevere: { backgroundColor: '#FF4C4C' },
  badgeMild: { backgroundColor: '#40B59F' },
  badgeText: { color: '#fff', fontSize: 14, fontWeight: '600' },

  date: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 24 },

  dayCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3
  },

  dayHeader: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 12 },
  userText: { fontSize: 16, color: '#333', marginBottom: 8, lineHeight: 24, paddingLeft: 4 },
  noActionText: { fontSize: 16, fontStyle: 'italic', color: '#999', paddingLeft: 4 },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },

  primaryButton: {
    flex: 1,
    backgroundColor: '#40B59F',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8
  },

  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#40B59F',
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonPressed: { opacity: 0.7 },

  primaryText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: '#40B59F', fontSize: 16, fontWeight: '600' }
});
