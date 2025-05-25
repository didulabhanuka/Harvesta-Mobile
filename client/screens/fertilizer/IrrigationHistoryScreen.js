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

        const groupedBar = {};
        const groupedLine = {};

        data.forEach(({ PlantAge, IrrigationValue, SoilMoisture }) => {
          if (!groupedBar[PlantAge]) groupedBar[PlantAge] = { total: 0, count: 0 };
          groupedBar[PlantAge].total += IrrigationValue;
          groupedBar[PlantAge].count += 1;

          if (!groupedLine[PlantAge]) groupedLine[PlantAge] = { total: 0, count: 0 };
          groupedLine[PlantAge].total += SoilMoisture;
          groupedLine[PlantAge].count += 1;
        });

        const sortedAges = Object.keys(groupedBar).sort((a, b) => a - b);

        const barLabels = sortedAges.map(age => `${age}`);
        const barAverages = sortedAges.map(
          age => parseFloat((groupedBar[age].total / groupedBar[age].count).toFixed(2))
        );

        setBarChartData({
          labels: barLabels,
          datasets: [
            {
              data: barAverages,
              color: () => `rgba(0, 150, 136, 1)`,
            },
          ],
          legend: ['Avg Irrigation Value (L)'],
        });

        const lineLabels = sortedAges.map(age => `${age}`);
        const lineAverages = sortedAges.map(
          age => parseFloat((groupedLine[age].total / groupedLine[age].count).toFixed(2))
        );

        setLineChartData({
          labels: lineLabels,
          datasets: [
            {
              data: lineAverages,
              color: () => `rgba(0, 150, 136, 1)`,
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
          {/* Bar Chart Card */}
          <View style={styles.card}>
            <View style={styles.chartRow}>
              <View style={styles.yAxisLabelWrapper}>
                <Text style={styles.yAxisLabel}>Irrigation (L)</Text>
              </View>
              <View>
                <View style={styles.chartLegend}>
                  <Text style={styles.legendText}>Avg Irrigation Value (L)</Text>
                </View>
                <BarChart
                  data={barChartData}
                  width={screenWidth - 100}
                  height={300}
                  yAxisSuffix="L"
                  fromZero
                  showBarTops
                  withInnerLines={true}
                  withVerticalLines={false}
                  withHorizontalLabels={true}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: () => `rgba(0, 150, 136, 1)`,
                    labelColor: () => `rgba(0, 150, 136, 1)`,
                    propsForLabels: { fontWeight: '600' },
                  }}
                  style={styles.chart}
                />
                <Text style={styles.xAxisLabel}>Plant Age (days)</Text>
              </View>
            </View>
          </View>

          {/* Line Chart Card */}
          <Text style={styles.subHeader}>Soil Water Content Variation</Text>
          <View style={styles.card}>
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
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 2,
                    color: () => `rgba(0, 150, 136, 1)`,
                    labelColor: () => `rgba(0, 150, 136, 1)`,
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#009688',
                    },
                    propsForLabels: { fontWeight: '600' },
                  }}
                  style={styles.chart}
                  withShadow
                  bezier
                />
                <Text style={styles.xAxisLabel}>Plant Age (days)</Text>
              </View>
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
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00695c',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 20,
    fontFamily: 'Poppins',
  },
  subHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00695c',
    marginTop: 30,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#40B59F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
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
  chartLegend: {
    alignItems: 'center',
    marginBottom: 6,
  },
  legendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#009688',
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    marginTop: 20,
  },
});
