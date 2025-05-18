// screens/ReminderSettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ALL_OFFSETS = [1, 3, 5, 7];

export default function ReminderSettingsScreen({ navigation }) {
  const [enabledOffsets, setEnabledOffsets] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('dayOffsets').then(json => {
      if (json) setEnabledOffsets(JSON.parse(json));
    });
  }, []);

  const toggleOffset = day => {
    setEnabledOffsets(prev =>
      prev.includes(day) ? prev.filter(x => x !== day) : [...prev, day]
    );
  };

  const save = () => {
    AsyncStorage.setItem('dayOffsets', JSON.stringify(enabledOffsets))
      .then(() => {
        Alert.alert('Saved', 'Your reminder schedule has been updated.');
        navigation.goBack();
      })
      .catch(() => {
        Alert.alert('Error', 'Could not save settings.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customize Reminder Days</Text>
      <Text style={styles.subheader}>
        Pick which days after diagnosis you want to be reminded.
      </Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {ALL_OFFSETS.map(day => {
          const on = enabledOffsets.includes(day);
          return (
            <View key={day} style={styles.card}>
              <View style={styles.cardRow}>
                <View style={styles.cardLabel}>
                  <Text style={styles.cardText}>Day {day}</Text>
                  <Text style={styles.cardDesc}>
                    {on
                      ? `Receive notification on day ${day}.`
                      : `No reminder on day ${day}.`}
                  </Text>
                </View>
                <Switch
                  value={on}
                  onValueChange={() => toggleOffset(day)}
                  trackColor={{ false: '#ccc', true: '#40B59F' }}
                  thumbColor={on ? '#fff' : '#fff'}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Ionicons name="checkmark-done" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>Save Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginHorizontal: 20,
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // leave space for button
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLabel: {
    flex: 1,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#40B59F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
