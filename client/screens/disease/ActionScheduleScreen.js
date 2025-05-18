// screens/disease/ActionScheduleScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Timeline from 'react-native-timeline-flatlist';
import { scheduleManualNotification } from '../../services/NotificationService';
import addDays from 'date-fns/addDays';

export default function ActionScheduleScreen({ route, navigation }) {
  const { recommendations, dayOffsets } = route.params;

  // Prepare data for the timeline component
  const timelineData = dayOffsets.map(offset => ({
    time: `Day ${offset}`,
    title: recommendations.join('\n'),
    circleColor: '#40B59F',
    lineColor: '#ccc'
  }));

  // Schedule notifications when the screen mounts
  useEffect(() => {
    dayOffsets.forEach(offset => {
      const when = addDays(new Date(), offset);
      scheduleManualNotification(
        `Reminder (Day ${offset}): ${recommendations.join(', ')}`,
        when
      );
    });
  }, [dayOffsets, recommendations]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.explanatory}>
        You’ll get notified on days {dayOffsets.join(', ')}
      </Text>

      <Timeline
        data={timelineData}
        circleSize={20}
        circleColor='#40B59F'
        lineColor='#ccc'
        timeContainerStyle={styles.timeContainer}
        descriptionStyle={styles.description}
        options={{ style: styles.timeline }}
      />

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('ReminderSettings')}
      >
        <Text style={styles.linkText}>Change Reminder Schedule</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F9' },
  content: { paddingVertical: 20, paddingHorizontal: 16 },
  explanatory: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  timeline: {
    padding: 0,
    backgroundColor: 'transparent'
  },
  timeContainer: {
    minWidth: 50,
    marginTop: -5
  },
  description: {
    color: '#333',
    fontSize: 14,
    lineHeight: 20
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center'
  },
  linkText: {
    color: '#40B59F',
    fontSize: 16,
    fontWeight: '600'
  }
});
