import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { CommonActions } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ screens }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Fertilization') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Disease Detection') {
            iconName = focused ? 'bug' : 'bug-outline';
          } else if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Pest Management') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'Harvest') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          }

          return (
            <View style={styles.iconWrapper}>
              <Ionicons name={iconName} size={28} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#40B59F',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarBackground: () => (
          <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
        ),
      })}
    >
      {screens.map(({ name, component }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              const state = navigation.getState();
              const tab = state.routes.find(r => r.name === route.name);
              
              if (tab?.state && tab?.state?.index > 0) {
                navigation.navigate(route.name);
              }
            }
          })}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 16,
    right: 16,
    elevation: 5,
    backgroundColor: 'transparent',
    borderRadius: 20,
    height: 60,
    borderTopWidth: 0,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    marginTop: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
