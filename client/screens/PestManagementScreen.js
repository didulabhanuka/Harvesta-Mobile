// /screens/PestManagementScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PestManagementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pest Management Screen</Text>
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
  },
});
