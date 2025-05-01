// /screens/HomeScreen.js

import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, FlatList, Dimensions, Animated, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { fetchWeatherByCoords } from '../services/weatherService';  // Import service

const { width: screenWidth } = Dimensions.get('window');

const features = [
  {
    id: '1',
    title: 'Fertilization',
    icon: <Ionicons name="water-outline" size={30} color="#40B59F" />,
    navigateTo: 'Fertilization',
  },
  {
    id: '2',
    title: 'Disease Detection',
    icon: <MaterialIcons name="bug-report" size={30} color="#40B59F" />,
    navigateTo: 'Disease Detection',
  },
  {
    id: '3',
    title: 'Pest Management',
    icon: <FontAwesome5 name="shield-virus" size={28} color="#40B59F" />,
    navigateTo: 'Pest Management',
  },
  {
    id: '4',
    title: 'Harvest',
    icon: <Feather name="feather" size={30} color="#40B59F" />,
    navigateTo: 'Harvest',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleCardPress = (navigateTo) => {
    navigation.navigate(navigateTo);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Allow location access to get weather information.');
        setLoadingWeather(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const data = await fetchWeatherByCoords(latitude, longitude);
      setWeatherData(data);

    } catch (error) {
      console.error('Location/Weather error:', error.message);
    } finally {
      setLoadingWeather(false);
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Farmer 👋</Text>
          <Text style={styles.subGreeting}>{dateString}</Text>
        </View>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        {loadingWeather ? (
          <ActivityIndicator size="small" color="#40B59F" />
        ) : (
          <>
            <Ionicons name="cloud-outline" size={30} color="#40B59F" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.weatherTemp}>
                {weatherData?.main?.temp}°C
              </Text>
              <Text style={styles.weatherStatus}>
                {weatherData?.weather[0]?.description}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="gray"
          style={styles.searchInput}
        />
      </View>

      {/* Feature Buttons */}
      <Animated.FlatList
        data={features}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.featuresContainer}
        style={{ opacity: fadeAnim }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.featureCard}
            activeOpacity={0.7}
            onPress={() => handleCardPress(item.navigateTo)}
          >
            {item.icon}
            <Text style={styles.featureTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  subGreeting: { fontSize: 14, color: '#666', marginTop: 4 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  weatherCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', borderRadius: 12, padding: 15, marginTop: 20 },
  weatherTemp: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  weatherStatus: { fontSize: 14, color: '#666' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#f1f1f1', borderRadius: 10, alignItems: 'center', paddingHorizontal: 15, marginTop: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, height: 50, fontSize: 16, color: '#333' },
  featuresContainer: { marginTop: 30, paddingBottom: 20 },
  featureCard: { backgroundColor: '#f9f9f9', flex: 1, margin: 8, borderRadius: 16, padding: 20, alignItems: 'center', justifyContent: 'center', height: screenWidth * 0.4, shadowColor: '#40B59F', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 5 },
  featureTitle: { marginTop: 10, fontSize: 14, fontWeight: '600', textAlign: 'center', color: '#333' },
});
