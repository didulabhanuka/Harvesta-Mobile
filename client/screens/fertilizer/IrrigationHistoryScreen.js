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
import { fetchIrrigationHistory } from '../../services/fertilizerServices';

const IrrigationHistoryScreen = () => {
  const screenWidth = Dimensions.get('window').width;
  const [barChartData, setBarChartData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchIrrigationHistory();

        // For Bar Chart: average IrrigationValue by PlantAge
        const groupedBar = {};

        // For Line Chart: average SoilMoisture by PlantAge
        const groupedLine = {};

        data.forEach(({ PlantAge, IrrigationValue, SoilMoisture }) => {
          // Bar chart grouping
          if (!groupedBar[PlantAge]) {
            groupedBar[PlantAge] = { total: 0, count: 0 };
          }
          groupedBar[PlantAge].total += IrrigationValue;
          groupedBar[PlantAge].count += 1;

          // Line chart grouping
          if (!groupedLine[PlantAge]) {
            groupedLine[PlantAge] = { total: 0, count: 0 };
          }
          groupedLine[PlantAge].total += SoilMoisture;
          groupedLine[PlantAge].count += 1;
        });

        // Sort PlantAge keys
        const sortedAges = Object.keys(groupedBar).sort((a, b) => a - b);

        // Prepare bar chart data
        const barLabels = sortedAges.map(age => `${age}`);
        const barAverages = sortedAges.map(
          age => parseFloat((groupedBar[age].total / groupedBar[age].count).toFixed(2))
        );

        setBarChartData({
          labels: barLabels,
          datasets: [
            {
              data: barAverages,
              color: (opacity = 1) => `rgba(77, 182, 172, ${opacity})`,
              label: 'Irrigation Value (%)',
            },
          ],
          legend: ['Irrigation Value (%)'],
        });

        // Prepare line chart data - average SoilMoisture by PlantAge
        const lineLabels = sortedAges.map(age => `${age}`);
        const lineAverages = sortedAges.map(
          age => parseFloat((groupedLine[age].total / groupedLine[age].count).toFixed(2))
        );

        setLineChartData({
          labels: lineLabels,
          datasets: [
            {
              data: lineAverages,
              color: (opacity = 1) => `rgba(0, 150, 136, ${opacity})`,
              strokeWidth: 2,
            },
          ],
          legend: ['Soil Moisture (%)'],
        });
      } catch (error) {
        console.error('Error loading irrigation history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.header}>Irrigation History Chart</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00796b" />
      ) : barChartData && lineChartData ? (
        <>
          {/* Bar Chart */}
          <View style={styles.chartRow}>
            <View style={styles.yAxisLabelWrapper}>
              <Text style={styles.yAxisLabel}>Irrigation Value (L)</Text>
            </View>
            <View>
              <BarChart
                data={barChartData}
                width={screenWidth - 100}
                height={300}
                yAxisSuffix="L"
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
              <Text style={styles.xAxisLabel}>Plant Age (days)</Text>
            </View>
          </View>

          {/* Line Chart */}
          <Text style={styles.subHeader}>Soil Water Content Variation</Text>
          <View style={styles.chartRow}>
            <View style={styles.yAxisLabelWrapper}>
              <Text style={styles.yAxisLabel}>Soil Moisture (%)</Text>
            </View>
            <View>
              <LineChart
                data={lineChartData}
                width={screenWidth - 100}
                height={300}
                chartConfig={{
                  backgroundColor: '#e0f2f1',
                  backgroundGradientFrom: '#b2dfdb',
                  backgroundGradientTo: '#80cbc4',
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#004d40',
                  },
                }}
                style={styles.chart}
                withShadow
                bezier
              />
              <Text style={styles.xAxisLabel}>Plant Age (days)</Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.error}>No irrigation data available.</Text>
      )}
    </ScrollView>
  );
};

export default IrrigationHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f2f1',
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
