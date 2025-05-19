import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { fetchFertilizerValue } from '../../services/fertilizerServices';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FertilizerDetailsScreen = () => {
  const navigation = useNavigation();
  const [soilN, setSoilN] = useState('');
  const [soilP, setSoilP] = useState('');
  const [soilK, setSoilK] = useState('');
  const [plantAge, setPlantAge] = useState('');
  const [fertilizerType, setFertilizerType] = useState('NPK 16-16-16');
  const [fertilizationValue, setFertilizationValue] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const screenWidth = Dimensions.get('window').width;

  const fertilizerTypes = [
    { label: 'NPK 16-16-16', value: 'NPK 16-16-16' },
    { label: 'NPK 20-10-10', value: 'NPK 20-10-10' },
    { label: 'NPK 15-15-15', value: 'NPK 15-15-15' },
    { label: 'NPK 10-26-26', value: 'NPK 10-26-26' },
    { label: 'NPK 14-18-18', value: 'NPK 14-18-18' },
    { label: 'NPK 12-12-17', value: 'NPK 12-12-17' },
  ];

  const handleCalculate = async () => {
    if (!soilN || !soilP || !soilK || !plantAge || !fertilizerType.trim()) {
      setErrorMessage('Please fill in all fields');
      setModalVisible(true);
      return;
    }

    if (isNaN(soilN) || isNaN(soilP) || isNaN(soilK) || isNaN(plantAge)) {
      setErrorMessage('Please enter valid numeric values');
      setModalVisible(true);
      return;
    }

    try {
      const result = await fetchFertilizerValue(
        soilN,
        soilP,
        soilK,
        plantAge,
        fertilizerType
      );
      if (result !== null) {
        setFertilizationValue(result);
        setChartData(prev => [...prev, result]);
      } else {
        setErrorMessage('Could not fetch fertilizer value.');
        setModalVisible(true);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
      setModalVisible(true);
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
      <Text style={styles.header}>Fertilizer Details</Text>

      {/* History Button */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('FertilizerHistoryScreen')}
      >
        <Icon name="history" size={20} color="white" style={styles.historyIcon} />
        <Text style={styles.historyButtonText}>History</Text>
      </TouchableOpacity>

      {/* NPK Levels */}
      {renderCard('N P K Levels', (
        <>
          <View style={styles.inputContainer}>
            <Icon name="seed" size={22} color="#FF5722" style={styles.icon} /> {/* N icon */}
            <TextInput
              style={styles.input}
              placeholder="Nitrogen (N)"
              keyboardType="numeric"
              value={soilN}
              onChangeText={setSoilN}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="flower" size={22} color="#FFEB3B" style={styles.icon} /> {/* P icon */}
            <TextInput
              style={styles.input}
              placeholder="Phosphorus (P)"
              keyboardType="numeric"
              value={soilP}
              onChangeText={setSoilP}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="leaf" size={22} color="#4CAF50" style={styles.icon} /> {/* K icon */}
            <TextInput
              style={styles.input}
              placeholder="Potassium (K)"
              keyboardType="numeric"
              value={soilK}
              onChangeText={setSoilK}
            />
          </View>
        </>
      ))}

      {/* Plant Age and Fertilizer Type */}
      {renderCard('Plant Age & Fertilizer Type', (
        <>
          <View style={styles.inputContainer}>
            <Icon name="calendar" size={22} color="#00796b" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Plant Age (Weeks)"
              keyboardType="numeric"
              value={plantAge}
              onChangeText={setPlantAge}
            />
          </View>
          <Text style={styles.label}>Fertilizer Type</Text>
          <RNPickerSelect
            value={fertilizerType}
            onValueChange={setFertilizerType}
            items={fertilizerTypes}
            style={pickerStyles}
            useNativeAndroidPickerStyle={false}
          />
        </>
      ))}

      {/* Calculate Button */}
      <TouchableOpacity style={styles.button} onPress={handleCalculate}>
        <Text style={styles.buttonText}>Calculate Fertilizer Value</Text>
      </TouchableOpacity>

      {/* Fertilizer Value */}
      {fertilizationValue !== null &&
        renderCard('Fertilizer Value', (
          <Text style={styles.resultValue}>
            {fertilizationValue.toFixed(2)} g
          </Text>
        ))}

      {/* Fertilizer Value Trend */}
      {chartData.length > 0 &&
        renderCard('Fertilizer Value Trend', (
          <LineChart
            data={{
              labels: chartData.map((_, index) => (index + 1).toString()),
              datasets: [{ data: chartData }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix=" g"
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
        ))}

      {/* Custom Error Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>⚠️ Input Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default FertilizerDetailsScreen;

const pickerStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f1fdf9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#40b59f',
    color: '#00796b',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f1fdf9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#40b59f',
    color: '#00796b',
    marginBottom: 10,
  },
};

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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#00796b',
    fontFamily: 'Poppins',
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
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#00796b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  historyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  historyIcon: {
    marginRight: 8,
  },

  // Custom Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#40b59f',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
