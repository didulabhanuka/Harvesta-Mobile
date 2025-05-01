// /components/WelcomeScreen.js

import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Animated, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For button fade animation

  const pages = [
    {
      animation: require('../assets/jsons/welcome_one.json'),
      title: 'Optimize Resources, Protect the Environment!',
      description: 'Automate irrigation and fertilization to reduce waste and protect the environment.',
    },
    {
      animation: require('../assets/jsons/welcome_two.json'),
      title: 'Revolutionize Plant Care!',
      description: 'Real-time insights into plant health, environment, and diseases for optimal growth.',
    },
    {
      animation: require('../assets/jsons/welcome_three.json'),
      title: 'Maximize Yields, Minimize Losses!',
      description: 'Automate pest detection and growth tracking to boost quality and save time.',
    },
  ];

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleGetStarted = () => {
    navigation.replace('Home');  // Replace 'Home' with your first screen name
  };

  // Animate fade-in when on last page
  useEffect(() => {
    if (currentIndex === pages.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <LottieView
              source={item.animation}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <ExpandingDot
        data={pages}
        expandingDotWidth={30}
        scrollX={scrollX}
        inActiveDotColor="#ccc"
        activeDotColor="#40B59F"
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: 5,
        }}
        containerStyle={{ marginBottom: 60 }}
      />

      {currentIndex === pages.length - 1 && (
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  page: {
    width: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  animation: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.4,
  },
  title: {
    marginTop: 30,
    fontSize: screenWidth * 0.05,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#3A3A3A',
    fontFamily: 'System',
  },
  description: {
    marginTop: 15,
    fontSize: screenWidth * 0.04,
    textAlign: 'center',
    color: '#8A8A8A',
    fontFamily: 'System',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
  },
  button: {
    backgroundColor: '#40B59F',
    paddingHorizontal: 100,
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
});
