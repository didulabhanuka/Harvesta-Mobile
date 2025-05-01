import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fetchHistoricalData } from '../../services/harvestService';
import { format } from 'date-fns';

const { width: screenWidth } = Dimensions.get('window');

export default function HistoricalDataScreen() {
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For smooth fade-in

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchHistoricalData();
      setHistoricalData(data);
    } catch (error) {
      console.error('Error fetching historical data:', error.message);
    } finally {
      setIsLoading(false);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }).start();
    }
  };

  const extractData = (key) => {
    return historicalData.map((entry) => entry[key] ?? 0);
  };

  const extractDates = () => {
    return historicalData.map((entry) => {
      try {
        return format(new Date(entry.date), 'MMM d');
      } catch {
        return '';
      }
    });
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 16 },
    propsForDots: { r: '4', strokeWidth: '2', stroke: '#40B59F' },
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#40B59F" />
        </View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>

            <Text style={styles.headerText}>Historical Data</Text>

            {/* Ripeness Chart */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Ripeness Distribution Over Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: extractDates(),
                    datasets: [
                      { data: extractData('unripe_percentage'), color: () => '#4CAF50', strokeWidth: 2 },
                      { data: extractData('half_ripe_percentage'), color: () => '#FFA500', strokeWidth: 2 },
                      { data: extractData('ripe_percentage'), color: () => '#FF4C4C', strokeWidth: 2 },
                    ],
                    legend: ['Unripe', 'Half-Ripe', 'Ripe'],
                  }}
                  width={Math.max(screenWidth, historicalData.length * 60)}
                  height={250}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              </ScrollView>
            </View>

            {/* Growth Speed Chart */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Growth Speed Rate Over Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: extractDates(),
                    datasets: [
                      { data: extractData('growth_speed_ripe'), color: () => '#2196F3', strokeWidth: 2 },
                    ],
                    legend: ['Growth Speed'],
                  }}
                  width={Math.max(screenWidth, historicalData.length * 60)}
                  height={250}
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chartStyle}
                />
              </ScrollView>
            </View>

          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingBottom: 50 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContainer: { padding: 20 },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  chartStyle: { borderRadius: 16 },
});
