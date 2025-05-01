// /screens/FertilizationScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FertilizationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Fertilization / Irrigation Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
