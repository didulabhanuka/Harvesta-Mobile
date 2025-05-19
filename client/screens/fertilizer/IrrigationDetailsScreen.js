import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const IrrigationDetailsScreen = () => {
  const [plantAge, setPlantAge] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [irrigationValue, setIrrigationValue] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [showInputAlert, setShowInputAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation(); // Initialize useNavigation

  const handleCalculate = async () => {
    if (!plantAge || !soilMoisture) {
      setAlertMessage('Please fill in all fields');
      setShowInputAlert(true);
      return;
    }

    if (isNaN(plantAge) || isNaN(soilMoisture)) {
      setAlertMessage('Please enter valid numeric values');
      setShowInputAlert(true);
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.1.48:5000/harvesta-api/fertilizermanagement/irrigation',
        {
          PlantAge: parseFloat(plantAge),
          SoilMoisture: parseFloat(soilMoisture),
        }
      );

      const value = response.data?.value?.IrrigationValue;
      if (value !== undefined) {
        setIrrigationValue(value);
        setChartData((prev) => [...prev, value]);
      } else {
        setAlertMessage('Invalid response from server.');
        setShowInputAlert(true);
      }
    } catch (error) {
      setAlertMessage('Network error. Please try again.');
      setShowInputAlert(true);
    }
  };

  const renderCard = (title, children) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={{ marginTop: 10 }}>{children}</View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Irrigation Details</Text>

      {/* History Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('IrrigationHistoryScreen')} // Navigate to the history screen
      >
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>

      {renderCard('Plant Age & Soil Moisture', (
        <>
          <View style={styles.inputContainer}>
            <Icon name="leaf" size={22} color="#00796b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Plant Age (days)"
              keyboardType="numeric"
              value={plantAge}
              onChangeText={setPlantAge}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="water" size={22} color="#00796b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Soil Moisture (%)"
              keyboardType="numeric"
              value={soilMoisture}
              onChangeText={setSoilMoisture}
            />
          </View>
        </>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate Irrigation Value</Text>
      </TouchableOpacity>

      {irrigationValue !== null &&
        renderCard('Irrigation Value', (
          <Text style={styles.resultValue}>
            {irrigationValue.toFixed(2)} Litres
          </Text>
        ))}

      {chartData.length > 0 &&
        renderCard('Irrigation Trend', (
          <View style={styles.chartContainer}>
            <Text style={styles.yAxisLabel}>Irrigation Value</Text>
            <LineChart
              data={{
                labels: chartData.map((_, index) => (index + 1).toString()),
                datasets: [{ data: chartData }],
              }}
              width={screenWidth - 40}
              height={220}
              yAxisSuffix=" L"
              chartConfig={{
                backgroundColor: '#e0f2f1',
                backgroundGradientFrom: '#b2dfdb',
                backgroundGradientTo: '#80cbc4',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 77, 64, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#004d40',
                },
              }}
              bezier
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </View>
        ))}

      <Modal
        visible={showInputAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInputAlert(false)}
      >
        <View style={styles.alertOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>⚠️ Input Error</Text>
            <Text style={styles.alertMessage}>{alertMessage}</Text>
            <TouchableOpacity style={styles.alertButton} onPress={() => setShowInputAlert(false)}>
              <Text style={styles.alertButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default IrrigationDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#e0f2f1',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004d40',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Poppins',
  },
  historyButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#00796b',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796b',
    fontFamily: 'Poppins',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1fdf9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#40b59f',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#00796b',
  },
  button: {
    backgroundColor: '#40b59f',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  yAxisLabel: {
    transform: [{ rotate: '-90deg' }],
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004d40',
    position: 'absolute',
    left: -30,
    top: 80,
  },
  alertOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#d32f2f',
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  alertButton: {
    marginTop: 16,
    backgroundColor: '#40b59f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
