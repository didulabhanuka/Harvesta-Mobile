import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Animated, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { fetchLatestData } from '../../services/harvestService';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

export default function HarvestScreen() {
  const navigation = useNavigation();
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadLatestData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLatestData();
    }, [])
  );

  const loadLatestData = async () => {
    try {
      setLoading(true);
      const data = await fetchLatestData();
      setPredictionData(data);

      if (data?.date) {
        const parsedDate = new Date(data.date);
        setLastUpdate(parsedDate.toLocaleString());
      } else {
        setLastUpdate('');
      }
    } catch (error) {
      console.error('Error fetching latest prediction data:', error.message);
      Alert.alert('Error', 'Failed to fetch latest data.');
      setLastUpdate('');
    } finally {
      setLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }
  };

  const pieChartData = predictionData ? [
    {
      name: 'Ripe',
      population: predictionData.ripe_percentage ?? 0,
      color: '#FF4C4C',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Semi-Ripe',
      population: predictionData.half_ripe_percentage ?? 0,
      color: '#FFA500',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
    {
      name: 'Unripe',
      population: predictionData.unripe_percentage ?? 0,
      color: '#4CAF50',
      legendFontColor: '#333',
      legendFontSize: 12,
    },
  ] : [];

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#40B59F" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.greeting}>Latest Update 📅</Text>
            {lastUpdate ? (
              <Text style={styles.lastUpdate}>{lastUpdate}</Text>
            ) : null}
          </View>

          <Animated.View style={{ opacity: fadeAnim }}>

            {/* Pie Chart Section */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Ripeness Status</Text>

              {predictionData ? (
                <>
                  <PieChart
                    data={pieChartData}
                    width={screenWidth * 0.7}
                    height={180}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />
                  {/* Legend */}
                  <View style={styles.legendContainer}>
                    <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#FF4C4C' }]} /><Text style={styles.legendText}>Ripe</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#FFA500' }]} /><Text style={styles.legendText}>Semi-Ripe</Text></View>
                    <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} /><Text style={styles.legendText}>Unripe</Text></View>
                  </View>
                </>
              ) : (
                <Text style={styles.infoText}>No data available.</Text>
              )}
            </View>

            {/* Environmental Conditions */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Optimal Environmental Conditions</Text>
              {predictionData ? (
                <>
                  <Text style={styles.infoText}>TEMPERATURE: {predictionData.temperature_setpoint ?? 'N/A'}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.infoText}>LIGHT INTENSITY: {predictionData.light_intensity_setpoint ?? 'N/A'}</Text>
                  <View style={styles.divider} />
                  <Text style={styles.infoText}>HUMIDITY: {predictionData.humidity_setpoint ?? 'N/A'}</Text>
                </>
              ) : (
                <Text style={styles.infoText}>No data available.</Text>
              )}
            </View>

            {/* Harvest Countdown */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Optimal Harvest Countdown</Text>
              {predictionData ? (
                <Text style={styles.infoText}>
                  {predictionData.harvest_time_days != null
                    ? `${Math.round(predictionData.harvest_time_days)} DAYS`
                    : 'N/A'}
                </Text>
              ) : (
                <Text style={styles.infoText}>No data available.</Text>
              )}
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={loadLatestData}>
                <Ionicons name="refresh" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Refresh Data</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UploadHarvestImage')}
              >
                <Text style={styles.buttonText}>Update Images</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('HarvestHistory')}
              >
                <Text style={styles.buttonText}>Historical Data</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>

        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingBottom: 50},
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  scrollContainer: { padding: 20 },
  headerContainer: { marginBottom: 20 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  lastUpdate: { fontSize: 14, color: '#666', marginTop: 4 },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#40B59F',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  infoText: { fontSize: 14, textAlign: 'center', color: '#555', marginVertical: 6 },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 8 },
  buttonContainer: { marginTop: 20 },
  button: {
    flexDirection: 'row',
    backgroundColor: '#40B59F',
    borderRadius: 10,
    paddingVertical: 14,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  legendContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
});
