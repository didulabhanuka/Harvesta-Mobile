// /components/SplashScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');  // Redirecting to 'Welcome'
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/jsons/splash-animation.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      {/* WRAP everything properly! */}
      <Text style={styles.appName}>
        HARVESTA
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
  appName: {
    marginTop: 20,
    fontSize: 36,
    color: '#333',
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});
