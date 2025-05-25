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
 * Schedule two daily reminders (8 AM & 8 PM) for plant disease action.
 * This replaces the old interval-based reminders so you only get pinged morning & evening.
 */
export async function scheduleAutoReminder() {
  // optionally clear any previous ones for this app:
  // await Notifications.cancelAllScheduledNotificationsAsync();

  // Morning at 08:00
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reminder',
      body: 'Take action for plant disease!',
    },
    trigger: {
      hour: 8,
      minute: 0,
      repeats: true,
    },
  });

  // Evening at 20:00
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Reminder',
      body: 'Take action for plant disease!',
    },
    trigger: {
      hour: 15,
      minute: 0,
      repeats: true,
    },
  });
}
