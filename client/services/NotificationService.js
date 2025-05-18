// services/NotificationService.js
import * as Notifications from 'expo-notifications';

/**
 * Schedule a one-off manual notification at the given Date.
 * @param {string} message - The notification body text.
 * @param {Date} date - JavaScript Date object indicating when to fire the notification.
 * @returns {Promise<string>} - The ID of the scheduled notification.
 */
export function scheduleManualNotification(message, date) {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reminder',
      body: message,
    },
    trigger: {
      time: date.getTime(),
      repeats: false,
    },
  });
}

/**
 * Schedule automatic recurring reminders based on disease severity.
 * - 'Severe': daily
 * - 'Moderate': every 5 days
 * - otherwise: every 7 days
 * @param {'Severe'|'Moderate'|string} severity
 * @returns {Promise<string>} - The ID of the scheduled notification.
 */
export function scheduleAutoReminder(severity) {
  let intervalDays;
  if (severity === 'Severe') {
    intervalDays = 1;
  } else if (severity === 'Moderate') {
    intervalDays = 5;
  } else {
    intervalDays = 7;
  }
  const seconds = intervalDays * 24 * 60 * 60;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reminder',
      body: 'Take action for plant disease!',
    },
    trigger: {
      seconds,
      repeats: true,
    },
  });
}
