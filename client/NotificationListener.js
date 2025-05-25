// NotificationListener.js
import React, { useEffect } from 'react';
import { Alert, LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';

// Suppress the Expo Go remote-push notification warning
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications)'
]);

export default function NotificationListener() {
  const navigation = useNavigation();

  useEffect(() => {
    // 1) Request permissions (iOS)
    Notifications.requestPermissionsAsync();

    // 2) Handle notifications received in the foreground
    const fgSub = Notifications.addNotificationReceivedListener(notification => {
      Alert.alert('Notification', notification.request.content.body);
    });

    // 3) Handle notification taps when app is backgrounded or foregrounded
    const tapSub = Notifications.addNotificationResponseReceivedListener(response => {
      const screen = response.notification.request.content.data?.screen;
      if (screen === 'DiseaseInfo') {
        navigation.navigate('DiseaseInfo');
      }
    });

    // 4) Handle cold-start from a notification tap
    Notifications.getLastNotificationResponseAsync().then(lastResponse => {
      const screen = lastResponse?.notification.request.content.data?.screen;
      if (screen === 'DiseaseInfo') {
        navigation.navigate('DiseaseInfo');
      }
    });

    return () => {
      fgSub.remove();
      tapSub.remove();
    };
  }, [navigation]);

  return null;
}


// services/NotificationService.js
// import * as Notifications from 'expo-notifications';

// /**
//  * Schedule a one-off manual notification at the given Date.
//  * @param {string} message - the notification body text
//  * @param {Date} date - when to fire the notification
//  */
// export function scheduleManualNotification(message, date) {
//   return Notifications.scheduleNotificationAsync({
//     content: { title: 'Reminder', body: message },
//     trigger: { time: date.getTime(), repeats: false }
//   });
// }

// /**
//  * Schedule repeated reminders based on severity:
//  * Severe: daily, Moderate: every 5 days, Mild: weekly
//  * @param {'Severe'|'Moderate'|'Mild'} severity
//  */
// export function scheduleAutoReminder(severity) {
//   let intervalDays;
//   if (severity === 'Severe') intervalDays = 1;
//   else if (severity === 'Moderate') intervalDays = 5;
//   else intervalDays = 7;
//   const seconds = intervalDays * 24 * 60 * 60;
//   return Notifications.scheduleNotificationAsync({
//     content: { title: 'Reminder', body: 'Take action for plant disease!' },
//     trigger: { seconds, repeats: true }
//   });
// }
