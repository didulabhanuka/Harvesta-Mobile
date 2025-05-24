// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import NotificationService from './NotificationListener';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
      {/* now safely nested inside NavigationContainer */}
      <NotificationService />
    </NavigationContainer>
  );
}
