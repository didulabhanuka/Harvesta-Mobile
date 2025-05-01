import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator'; 
import SplashScreen from '../components/SplashScreen';
import WelcomeScreen from '../components/WelcomeScreen';

import HomeScreen from '../screens/HomeScreen';
import FertilizationScreen from '../screens/FertilizationScreen';
import DiseaseDetectionScreen from '../screens/DiseaseDetectionScreen';
import PestManagementScreen from '../screens/PestManagementScreen';
import HarvestScreen from '../screens/HarvestScreen';

const Stack = createNativeStackNavigator();

// Home Stack
function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Fertilization Stack
function FertilizationStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FertilizationMain" component={FertilizationScreen} />
    </Stack.Navigator>
  );
}

// Disease Detection Stack
function DiseaseDetectionStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiseaseDetectionMain" component={DiseaseDetectionScreen} />
    </Stack.Navigator>
  );
}

// Pest Management Stack
function PestManagementStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PestManagementMain" component={PestManagementScreen} />
    </Stack.Navigator>
  );
}

// Harvest Stack 
function HarvestStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HarvestMain" component={HarvestScreen} />
    </Stack.Navigator>
  );
}


// App Navigator
export default function AppNavigator() {
  const screens = [
    { name: 'Fertilization', component: FertilizationStackScreen },
    { name: 'Disease Detection', component: DiseaseDetectionStackScreen },
    { name: 'Home', component: HomeStackScreen },
    { name: 'Pest Management', component: PestManagementStackScreen },
    { name: 'Harvest', component: HarvestStackScreen },
  ];

  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home">
        {() => <TabNavigator screens={screens} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
