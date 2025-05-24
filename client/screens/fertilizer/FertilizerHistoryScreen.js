import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';

import { fetchFertilizerHistory } from '../../services/fertilizerServices';

const k = 0.05;

const FertilizerHistoryScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const [barChartData, setBarChartData] = useState(null);
  const [sqiChartData, setSqiChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchFertilizerHistory();

        const groupedFertilizer = {};
        const groupedSQI = {};

        data.forEach(({ PlantAge, FertilizerValue, SoilN, SoilP, SoilK }) => {
          if (!groupedFertilizer[PlantAge]) {
            groupedFertilizer[PlantAge] = { total: 0, count: 0 };
          }
          groupedFertilizer[PlantAge].total += parseFloat(FertilizerValue);
          groupedFertilizer[PlantAge].count += 1;

          const soilNVal = parseFloat(SoilN);
          const soilPVal = parseFloat(SoilP);
          const soilKVal = parseFloat(SoilK);
          const fertilizerVal = parseFloat(FertilizerValue);

          const sqi = (soilNVal + soilPVal + soilKVal) / 3 - k * fertilizerVal;

          if (!groupedSQI[PlantAge]) {
            groupedSQI[PlantAge] = { total: 0, count: 0 };
          }
          groupedSQI[PlantAge].total += sqi;
          groupedSQI[PlantAge].count += 1;
        });

        const sortedAges = Object.keys(groupedFertilizer).sort((a, b) => a - b);

        const barLabels = sortedAges.map(age => `${age}`);
        const barAveragedValues = sortedAges.map(
          age => groupedFertilizer[age].total / groupedFertilizer[age].count
        );  

        setBarChartData({
          labels: barLabels,
          datasets: [
            {
              data: barAveragedValues.map(val => Number(val.toFixed(2))),
              color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
            },
          ],
          legend: ['Avg Fertilizer Value (mg)'],
        });

        const sqiLabels = sortedAges.map(age => `${age}`);
        const sqiAveragedValues = sortedAges.map(
          age => groupedSQI[age].total / groupedSQI[age].count
        );

        setSqiChartData({
          labels: sqiLabels,
          datasets: [
            {
              data: sqiAveragedValues.map(val => Number(val.toFixed(2))),
              color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['Soil Quality Index (SQI)'],
        });
      } catch (error) {
        console.error('Error loading fertilizer history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Fertilizer History Chart</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00796b" />
      ) : barChartData ? (
        <>
          <View style={styles.chartRow}>
            <View style={styles.yAxisLabelWrapper}>
              <Text style={styles.yAxisLabel}>Fertilizer (mg)</Text>
            </View>
            <View>
              <BarChart
                data={barChartData}
                width={screenWidth - 100}
                height={300}
                yAxisSuffix="mg"
                chartConfig={{
                  backgroundColor: '#e0f2f1',
                  backgroundGradientFrom: '#b2dfdb',
                  backgroundGradientTo: '#80cbc4',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
                  barPercentage: 0.5,
                }}
                style={styles.chart}
                fromZero
                showBarTops
                withHorizontalLabels
              />
              <Text style={styles.xAxisLabel}>Plant Age (Weeks)</Text>
            </View>
          </View>

          <Text style={styles.subHeader}>Soil Quality Index (SQI) Over Time</Text>
          <View style={styles.chartRow}>
            <View style={styles.yAxisLabelWrapper}>
              <Text style={styles.yAxisLabel}>SQI</Text>
            </View>
            <View>
              <LineChart
                data={sqiChartData}
                width={screenWidth - 100}
                height={300}
                chartConfig={{
                  backgroundColor: '#e0f2f1',
                  backgroundGradientFrom: '#b2dfdb',
                  backgroundGradientTo: '#80cbc4',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#009688',
                  },
                }}
                style={styles.chart}
                withShadow
                bezier
              />
              <Text style={styles.xAxisLabel}>Plant Age (Weeks)</Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.error}>No fertilizer data available.</Text>
      )}
    </ScrollView>
  );
};

export default FertilizerHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00695c',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00695c',
    marginTop: 30,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  yAxisLabelWrapper: {
    width: 40,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  yAxisLabel: {
    transform: [{ rotate: '-90deg' }],
    fontSize: 14,
    color: '#004d40',
    fontWeight: '600',
    textAlign: 'center',
    width: 100,
  },
  xAxisLabel: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 14,
    color: '#004d40',
    fontWeight: '600',
  },
  chart: {
    borderRadius: 16,
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    marginTop: 20,
  },
});
