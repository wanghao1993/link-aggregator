import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

// Screens
import { 
  HomeScreen, 
  AddLinkScreen, 
  SearchScreen, 
  SettingsScreen, 
  LinkDetailScreen 
} from '@/screens';
import { colors } from '@/constants/colors';

export type RootStackParamList = {
  MainTabs: undefined;
  LinkDetail: { linkId: string };
  AddLink: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  AddLink: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral[500],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: colors.border.light,
        },
        headerStyle: {
          backgroundColor: colors.background.light,
        },
        headerTintColor: colors.text.light.primary,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          title: 'My Links',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
          title: 'Search',
        }}
      />
      <Tab.Screen
        name="AddLink"
        component={AddLinkScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="plus-circle" size={size} color={color} />
          ),
          title: 'Add Link',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="settings" size={size} color={color} />
          ),
          title: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LinkDetail"
          component={LinkDetailScreen}
          options={{ title: 'Link Details' }}
        />
        <Stack.Screen
          name="AddLink"
          component={AddLinkScreen}
          options={{ title: 'Add New Link' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}