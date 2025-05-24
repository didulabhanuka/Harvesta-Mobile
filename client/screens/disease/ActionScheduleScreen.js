// screens/disease/ActionScheduleScreen.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  PanResponder,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { scheduleMorningEveningReminders } from '../../services/NotificationService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ActionScheduleScreen({ route }) {
  const { recordId, recommendationsByDay = {}, dayOffsets = [] } = route.params;
  const [index, setIndex] = useState(0);
  const day = dayOffsets[index];
  const todaysRecs = recommendationsByDay[`Day${day}`] || [];

  // track each checkbox
  const [completed, setCompleted] = useState(Array(todaysRecs.length).fill(false));
  // keep an explicit list of *this day’s* selected items
  const [selectedActions, setSelectedActions] = useState([]);

  const storageKey = `history_${recordId}_day${day}`;

  // swipe to change day
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 20,
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -20 && index < dayOffsets.length - 1) setIndex(i => i + 1);
        if (dx > 20 && index > 0) setIndex(i => i - 1);
      },
    })
  ).current;

  // on day change: reload local state + schedule reminders
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        const arr = stored ? JSON.parse(stored) : Array(todaysRecs.length).fill(false);
        setCompleted(arr);

        // derive today’s selected actions
        const sel = todaysRecs.filter((_, idx) => arr[idx]);
        setSelectedActions(sel);
      } catch {
        setCompleted(Array(todaysRecs.length).fill(false));
        setSelectedActions([]);
      }

      await scheduleMorningEveningReminders(
        null,
        [day],
        [`Day ${day} tasks:\n• ${todaysRecs.join('\n• ')}`]
      );
    })();
  }, [day, storageKey, todaysRecs]);

  // send selectedActions to backend
  const saveSelectedActionsToBackend = async (reportId, day, actions) => {
    try {
      await axios.post(
        'http://192.168.1.113:5000/harvesta-api/diseasepredict/save_selected_actions',
        { reportId, day, selectedActions: actions }
      );
    } catch (err) {
      console.error('Error saving selected actions:', err);
      Alert.alert('Sync Failed', 'Couldn’t sync to server, but saved locally.');
    }
  };

  // toggle one item
  const toggleComplete = useCallback(i => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setCompleted(prev => {
      const next = [...prev];
      next[i] = !next[i];

      // build *only* this day’s selections
      const todaySelected = todaysRecs.filter((_, idx) => next[idx]);
      setSelectedActions(todaySelected);

      // persist locally & remotely
      AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch(()=>{});
      saveSelectedActionsToBackend(recordId, day, todaySelected);

      return next;
    });
  }, [recordId, day, storageKey, todaysRecs]);

  // explicit save button
  const saveAll = async () => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(completed));
      Alert.alert('Saved', `Your Day ${day} progress was saved.`);
    } catch {
      Alert.alert('Error', 'Could not save locally.');
    }
  };

  const progress = ((index + 1) / dayOffsets.length) * 100;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => index > 0 && setIndex(i => i - 1)} disabled={index === 0}>
          <Ionicons
            name="chevron-back-circle"
            size={32}
            color={index === 0 ? '#ccc' : '#40B59F'}
          />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerText}>Day {day}</Text>
          <Text style={styles.subheaderText}>{index + 1} of {dayOffsets.length}</Text>
        </View>
        <Pressable onPress={() => index < dayOffsets.length - 1 && setIndex(i => i + 1)}
                   disabled={index === dayOffsets.length - 1}>
          <Ionicons
            name="chevron-forward-circle"
            size={32}
            color={index === dayOffsets.length - 1 ? '#ccc' : '#40B59F'}
          />
        </Pressable>
      </View>

      {/* Task List */}
      <ScrollView style={styles.card}>
        {todaysRecs.length === 0
          ? <Text style={styles.emptyText}>No tasks for Day {day}</Text>
          : todaysRecs.map((rec, i) => (
            <Pressable
              key={i}
              style={({ pressed }) => [
                styles.actionRow,
                pressed && styles.rowPressed,
                completed[i] && styles.rowDone,
              ]}
              onPress={() => toggleComplete(i)}
            >
              <Ionicons
                name={completed[i] ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={completed[i] ? '#40B59F' : '#666'}
              />
              <Text style={[styles.actionText, completed[i] && styles.actionTextDone]}>
                {rec}
              </Text>
            </Pressable>
          ))
        }
      </ScrollView>

      {/* Save Button */}
      <Pressable style={styles.saveBtn} onPress={saveAll}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.saveText}>Save Day {day}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#F4F4F9' , marginTop:40 },
  progressTrack: { height:4, backgroundColor:'#eee' },
  progressFill: { height:4, backgroundColor:'#40B59F' },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', margin:16 },
  headerCenter: { alignItems:'center' },
  headerText: { fontSize:22, fontWeight:'600', color:'#333' },
  subheaderText: { fontSize:14, color:'#666', marginTop:4 },
  card: {
    backgroundColor:'#fff',
    marginHorizontal:16,
    borderRadius:20,
    paddingVertical:8,
    paddingHorizontal:4,
    shadowColor:'#000',
    shadowOpacity:0.1,
    shadowOffset:{width:0,height:2},
    shadowRadius:8,
    elevation:4,
    maxHeight:500
  },
  emptyText: { textAlign:'center', color:'#999', marginVertical:20 },
  actionRow: { flexDirection:'row', alignItems:'center', padding:16, borderBottomWidth:1, borderBottomColor:'#eee' },
  rowPressed: { backgroundColor:'#E8F5E9' },
  rowDone: { backgroundColor:'#E3F2FD' },
  actionText: { marginLeft:12, fontSize:16, color:'#333' },
  actionTextDone: { textDecorationLine:'line-through', color:'#888' },
  saveBtn: {
    flexDirection:'row', justifyContent:'center', alignItems:'center',
    backgroundColor:'#40B59F', margin:16, paddingVertical:14, borderRadius:12, elevation:2
  },
  saveText: { color:'#fff', fontSize:16, fontWeight:'600', marginLeft:8 },
});
