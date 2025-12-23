import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import FeedScreen from './src/screens/FeedScreen';
import QuestsScreen from './src/screens/QuestsScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#667eea',
            tabBarInactiveTintColor: '#999',
            headerStyle: {
              backgroundColor: '#667eea',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopColor: '#e0e0e0',
            },
          }}
        >
          <Tab.Screen
            name="Feed"
            component={FeedScreen}
            options={{
              title: '📸 Лента',
              tabBarLabel: 'Лента',
              tabBarIcon: ({ color, size }) => (
                <TabIcon emoji="📸" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Quests"
            component={QuestsScreen}
            options={{
              title: '🎯 Квесты',
              tabBarLabel: 'Квесты',
              tabBarIcon: ({ color, size }) => (
                <TabIcon emoji="🎯" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{
              title: '🏆 Рейтинг',
              tabBarLabel: 'Рейтинг',
              tabBarIcon: ({ color, size }) => (
                <TabIcon emoji="🏆" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}

function TabIcon({ emoji, color, size }: { emoji: string; color: string; size: number }) {
  return (
    <Text style={{ fontSize: size, color }}>{emoji}</Text>
  );
}

