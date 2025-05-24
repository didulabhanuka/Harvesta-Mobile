import React from 'react';
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function FertilizationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Action</Text>
      <Text style={styles.subtitle}>Helping your plants grow strong and healthy</Text>

      {/* Fertilizer Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FertilizerDetailsScreen')}
      >
        <Icon name="seed" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Fertilizer</Text>
      </TouchableOpacity>

      {/* Irrigation Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('IrrigationDetailsScreen')}
      >
        <Icon name="sprinkler" size={24} color="#fff" style={styles.buttonIcon} />
        <Text style={styles.buttonText}>Irrigation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#00796b',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#40B59F',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    fontFamily: 'Poppins',
  },
  buttonIcon: {
    marginRight: 10,
  },
});
