// screens/disease/DiseaseInfoScreen.js
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDiseaseInfo } from "../../services/diseaseService";
import { scheduleAutoReminder } from "../..//services/NotificationService";
import { Ionicons } from '@expo/vector-icons';

function CheckBoxRow({ label, checked, onPress }) {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onPress}>
      <Ionicons
        name={checked ? 'checkbox' : 'checkbox-outline'}
        size={24}
        color={checked ? '#40B59F' : '#666'}
      />
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function DiseaseInfoScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [diseaseInfo, setDiseaseInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionsTaken, setActionsTaken] = useState([]);

  // Default offsets if none saved
  const DEFAULT_OFFSETS = [1, 3, 5];

  // Configure header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Disease Info',
      headerStyle: { backgroundColor: '#40B59F' },
      headerTintColor: '#fff',
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('ReminderSettings')}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  useEffect(() => {
    const getDiseaseInfo = async () => {
      try {
        const info = await fetchDiseaseInfo(imageUri);
        setDiseaseInfo(info);
        setActionsTaken(new Array(info.recommendations.length).fill(false));
        scheduleAutoReminder(info.predicted_severity);
      } catch (error) {
        console.error("Couldn't fetch disease info", error);
        Alert.alert("Error", "Could not fetch disease info.");
      } finally {
        setLoading(false);
      }
    };
    getDiseaseInfo();
  }, [imageUri]);

  const toggleAction = (idx) => {
    setActionsTaken(prev => {
      const copy = [...prev]; copy[idx] = !copy[idx];
      return copy;
    });
  };

  const viewActionPlan = async () => {
    if (!diseaseInfo?.recommendations) {
      return Alert.alert("No recommendations available");
    }
    const json = await AsyncStorage.getItem("dayOffsets");
    const dayOffsets = json ? JSON.parse(json) : DEFAULT_OFFSETS;
    navigation.navigate("ActionSchedule", {
      recommendations: diseaseInfo.recommendations,
      dayOffsets
    });
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#40B59F" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Disease Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{diseaseInfo.predicted_disease}</Text>
        <Text
          style={[
            styles.badge,
            { backgroundColor: diseaseInfo.predicted_severity === 'Severe' ? '#FF4C4C' : '#40B59F' }
          ]}
        >
          {diseaseInfo.predicted_severity}
        </Text>
        {diseaseInfo.image_base64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${diseaseInfo.image_base64}` }}
            style={styles.cardImage}
          />
        )}
      </View>

      {/* Recommendations Card */}
      <View style={styles.recommendation_card}>
        <Text style={styles.subtitle}>What to do next</Text>
        {diseaseInfo.recommendations.map((rec, idx) => (
          <CheckBoxRow
            key={idx}
            label={rec}
            checked={actionsTaken[idx]}
            onPress={() => toggleAction(idx)}
          />
        ))}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.primaryButton} onPress={viewActionPlan}>
        <Text style={styles.primaryButtonText}>View Action Plan</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('ReminderSettings')}>
        <Text style={styles.secondaryButtonText}>Customize Reminders</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F9',padddingbottom: 20 },
  content: { padding: 10 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 30, marginBottom: 20, elevation: 3, marginTop: 50 },
  recommendation_card: { backgroundColor: '#fff', borderRadius: 12, padding: 30, marginBottom: 20, elevation: 3, marginTop: 20 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  badge: { alignSelf: 'flex-start', color: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, overflow: 'hidden', marginBottom: 12 },
  badgeText: { fontSize: 24, fontWeight: 'bold' },
  cardImage: { width: '100%', height: 200, borderRadius: 4, resizeMode: 'cover', marginTop: 8 },
  subtitle: { fontSize: 20, fontWeight: '600', color: '#333', marginBottom: 12 },
  checkRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkLabel: { marginLeft: 12, fontSize: 16, color: '#333' },
  primaryButton: { backgroundColor: '#40B59F', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#40B59F', paddingVertical: 14, borderRadius: 12, alignItems: 'center',marginBottom: 90 },
  secondaryButtonText: { color: '#40B59F', fontSize: 18, fontWeight: 'bold', }
});
