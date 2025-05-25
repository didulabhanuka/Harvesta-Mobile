
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import SplashScreen from "../components/SplashScreen";
import WelcomeScreen from "../components/WelcomeScreen";
import HomeScreen from '../screens/HomeScreen';


import ImageUploadScreen from '../screens/disease/DiseaseImageUpload';
import MainDiseaseDetectionScreen from '../screens/disease/MainDiseaseDetectionScreen';
import DiseaseInfoScreen from '../screens/disease/DiseaseInfoScreen';
import DiseaseHistoryScreen from '../screens/disease/DiseaseHistoryScreen';
import HistoryDetailScreen from '../screens/disease/HistoryDetailScreen';
import ActionScheduleScreen from '../screens/disease/ActionScheduleScreen';
import ReminderSettingsScreen from '../screens/disease/ReminderSettingsScreen';

import UploadPestImageScreen from "../screens/pest/UploadPestImageScreen";
import PestResultScreen from "../screens/pest/PestResultScreen";
import PestMainMenuScreen from "../screens/pest/PestMainMenuScreen";
import PestHistoryScreen from "../screens/pest/PestHistoryScreen";

import HarvestScreen from "../screens/harvest/HarvestScreen";
import UploadHarvestImageScreen from "../screens/harvest/UploadHarvestImageScreen";
import HistoricalDataScreen from "../screens/harvest/HistoricalDataScreen";

import FertilizationScreen from "../screens/fertilizer/FertilizationScreen";
import FertilizerDetailsScreen from "../screens/fertilizer/FertilizerDetailsScreen";
import FertilizerHistoryScreen from "../screens/fertilizer/FertilizerHistoryScreen";
import IrrigationDetailsScreen from "../screens/fertilizer/IrrigationDetailsScreen";
import IrrigationHistoryScreen from "../screens/fertilizer/IrrigationHistoryScreen";

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
      <Stack.Screen
        name="FertilizerDetailsScreen"
        component={FertilizerDetailsScreen}
      />
      <Stack.Screen
        name="FertilizerHistoryScreen"
        component={FertilizerHistoryScreen}
      />
      <Stack.Screen
        name="IrrigationDetailsScreen"
        component={IrrigationDetailsScreen}
      />
      <Stack.Screen
        name="IrrigationHistoryScreen"
        component={IrrigationHistoryScreen}
      />
    </Stack.Navigator>
  );
}

// Disease Detection Stack
function DiseaseDetectionStackScreen({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const state = navigation.getState();
      if (state?.routes?.length > 1) {
        navigation.popToTop();
      }
    });

    return unsubscribe;
  }, [navigation]);


  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="DiseaseDetectionMain" component={DiseaseDetectionScreen} /> */}
      <Stack.Screen name="DiseaseDetectionScreen" component={MainDiseaseDetectionScreen} />
      <Stack.Screen name="ImageUploadScreen" component={ImageUploadScreen} />
      <Stack.Screen name="DiseaseInfo" component={DiseaseInfoScreen} />
      <Stack.Screen name="DiseaseHistoryScreen" component={DiseaseHistoryScreen} />
      <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
        <Stack.Screen name="ActionSchedule" component={ActionScheduleScreen}/>
    <Stack.Screen name="ReminderSettings" component={ReminderSettingsScreen}/>
    </Stack.Navigator>
  );
}


// Pest Management Stack
function PestManagementStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomePest"
        component={PestMainMenuScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadPestImage"
        component={UploadPestImageScreen}
        options={{ headerShown: false }} // <-- Hide header here
      />
      <Stack.Screen
        name="PestResult"
        component={PestResultScreen}
        options={{ title: "Prediction Result" }} // Back button appears
      />
      <Stack.Screen
        name="PestHistory"
        component={PestHistoryScreen}
        options={{ title: "Prediction History" }} // Back button appears
      />
    </Stack.Navigator>
  );
}
// Harvest Stack
function HarvestStackScreen({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      const state = navigation.getState();
      if (state?.routes?.length > 1) {
        navigation.popToTop();
      }
    });
    

    return unsubscribe;
  }, [navigation]);

  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HarvestMain" component={HarvestScreen} />
      <Stack.Screen
        name="UploadHarvestImage"
        component={UploadHarvestImageScreen}
      />
      <Stack.Screen name="HarvestHistory" component={HistoricalDataScreen} />
    </Stack.Navigator>
  );

  
}

// App Navigator
export default function AppNavigator() {
  const screens = [
    { name: "Fertilization", component: FertilizationStackScreen },
    { name: "Disease Detection", component: DiseaseDetectionStackScreen },
    { name: "Home", component: HomeStackScreen },
    // { name: "Pest Management", component: PestManagementStackScreen },
    { name: "Pest Management", component: PestManagementStackScreen },
    { name: "Harvest", component: HarvestStackScreen },
  ];

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Home">
        {() => <TabNavigator screens={screens} />}
      </Stack.Screen>
      
    </Stack.Navigator>
  );
}
