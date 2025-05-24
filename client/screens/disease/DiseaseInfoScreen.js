// screens/disease/DiseaseInfoScreen.js

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchDiseaseInfo } from "../../services/diseaseService";
import { scheduleAutoReminder } from "../../services/NotificationService";
import { Ionicons } from "@expo/vector-icons";

function CheckBoxRow({ label, checked, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.checkRow,
        pressed && styles.rowPressed,
        checked && styles.rowChecked,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={checked ? "checkbox" : "checkbox-outline"}
        size={24}
        color={checked ? "#40B59F" : "#666"}
      />
      <Text style={[styles.checkLabel, checked && styles.checkLabelDone]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function DiseaseInfoScreen({ route, navigation }) {
  const { imageUri } = route.params;
  const [recordId, setRecordId] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // this will be the flat list for the initial checklist
  const [flatRecs, setFlatRecs] = useState([]);
  const [actionsTaken, setActionsTaken] = useState([]);

  const DEFAULT_OFFSETS = [1, 3, 5];

  const viewActionPlan = useCallback(async () => {
    if (flatRecs.length === 0) {
      return Alert.alert("No recommendations available");
    }
    const json = await AsyncStorage.getItem("dayOffsets");
    const offsets = json ? JSON.parse(json) : DEFAULT_OFFSETS;

    navigation.navigate("ActionSchedule", {
      recordId: info.reportId,
      recommendationsByDay: info.recommendationsByDay, // ← use this
      dayOffsets: offsets,
      imageUri,
    });
  }, [info, navigation, imageUri]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Disease Info",
      headerStyle: { backgroundColor: "#40B59F", elevation: 0 },
      headerTintColor: "#fff",
      headerLeft: () => (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerIcon}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      ),
      headerRight: () => (
        <Pressable onPress={viewActionPlan} style={styles.headerIcon}>
          <Ionicons name="ios-list" size={24} color="#fff" />
        </Pressable>
      ),
    });
  }, [navigation, viewActionPlan]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchDiseaseInfo(imageUri);
        setRecordId(data.reportId);
        setInfo(data);

        // extract the recommendations_by_day map (snake_case) or fallback to camelCase
        const byDay =
          data.recommendations_by_day || data.recommendationsByDay || {};

        // flatten into one array for the initial list
        const flat = Object.values(byDay).flat();
        setFlatRecs(flat);
        setActionsTaken(new Array(flat.length).fill(false));

        scheduleAutoReminder();
      } catch {
        Alert.alert(
          "Network Error",
          "Unable to fetch disease information. Please try again."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [imageUri]);

  const toggleAction = (idx) =>
    setActionsTaken((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });

  if (loading) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#40B59F" />
      </View>
    );
  }
if (!info) {
  return (
    <View style={styles.loaderWrap}>
      <Text>Unable to load disease info.</Text>
    </View>
  )
}
  return (
    <ScrollView style={styles.container}>
      {/* — Page Title — */}
      <Text style={styles.pageTitle}>Disease Information</Text>

      {/* Disease Card */}
      <View style={styles.card}>
        {info && info.image_base64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${info.image_base64}` }}
            style={styles.image}
          />
        ) : (
          <Text>No image available</Text> // Fallback message if image is missing
        )}

        <Text style={styles.diseaseName}>{info.predicted_disease}</Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                info.predicted_severity === "Severe" ? "#FF4C4C" : "#40B59F",
            },
          ]}
        >
          <Ionicons
            name="warning-outline"
            size={16}
            color="#fff"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.badgeText}>{info.predicted_severity}</Text>
        </View>
      </View>

      {/* Flat Recommendation List */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="hammer-outline" size={20} color="#40B59F" />
          <Text style={styles.sectionTitle}>What to do next</Text>
        </View>
        {flatRecs.map((rec, i) => (
          <CheckBoxRow
            key={i}
            label={rec}
            checked={actionsTaken[i]}
            onPress={() => toggleAction(i)}
          />
        ))}
      </View>

      {/* Footer Buttons */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={viewActionPlan}
        >
          <Text style={styles.primaryText}>View Action Plan</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => navigation.navigate("ReminderSettings")}
        >
          <Text style={styles.secondaryText}>Customize Reminders</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F4F8" },
  loaderWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  headerIcon: { paddingHorizontal: 16 },

  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginTop: 16,
    marginHorizontal: 16,
  },

  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  badge: {
    flexDirection: "row",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowPressed: {
    backgroundColor: "#E8F5E9",
  },
  rowChecked: {
    backgroundColor: "#E3F2FD",
  },
  checkLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#444",
  },
  checkLabelDone: {
    textDecorationLine: "line-through",
    color: "#888",
  },

  buttonRow: {
    margin: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#40B59F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    
    marginRight: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#40B59F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  primaryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryText: {
    color: "#40B59F",
    fontSize: 16,
    fontWeight: "600",
  },
});
