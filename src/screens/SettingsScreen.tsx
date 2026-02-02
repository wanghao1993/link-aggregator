import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants';
import { useLinkStore } from '@/stores';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoFetchMetadata, setAutoFetchMetadata] = useState(true);
  
  const { links, clearAllLinks, exportLinks } = useLinkStore();

  const handleExportData = async () => {
    try {
      const data = exportLinks();
      const jsonString = JSON.stringify(data, null, 2);
      const date = new Date().toISOString().split('T')[0];
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync({
          mimeType: 'application/json',
          dialogTitle: 'Export Links',
          filename: `link-aggregator-export-${date}.json`,
        }, {
          content: jsonString,
        });
      } else {
        Alert.alert('Export', 'Sharing is not available on this device');
      }
    } catch (error) {
      console.error('Export failed:', error);
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = () => {
    Alert.alert('Import Data', 'This feature is not implemented yet. In a real app, you would select a JSON file to import.');
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all your links? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            clearAllLinks();
            Alert.alert('Success', 'All links have been deleted');
          }
        },
      ]
    );
  };

  const handleResetApp = () => {
    Alert.alert(
      'Reset App',
      'This will reset all app settings to defaults. Your links will not be affected.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'App has been reset');
          }
        },
      ]
    );
  };

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          description: 'Switch between light and dark theme',
          type: 'switch',
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          icon: 'grid',
          label: 'Layout',
          description: 'Change link display layout',
          type: 'button',
          onPress: () => Alert.alert('Layout', 'Change layout option'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: 'bell',
          label: 'Notifications',
          description: 'Enable push notifications',
          type: 'switch',
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          icon: 'download',
          label: 'Auto-fetch Metadata',
          description: 'Automatically fetch metadata when adding links',
          type: 'switch',
          value: autoFetchMetadata,
          onValueChange: setAutoFetchMetadata,
        },
        {
          icon: 'tag',
          label: 'Default Tags',
          description: 'Set default tags for new links',
          type: 'button',
          onPress: () => Alert.alert('Default Tags', 'Set default tags'),
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: 'download',
          label: 'Export Data',
          description: 'Export all links as JSON',
          type: 'button',
          onPress: handleExportData,
        },
        {
          icon: 'upload',
          label: 'Import Data',
          description: 'Import links from JSON file',
          type: 'button',
          onPress: handleImportData,
        },
        {
          icon: 'trash-2',
          label: 'Clear All Data',
          description: 'Delete all saved links',
          type: 'button',
          onPress: handleClearData,
          color: colors.error,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'info',
          label: 'About App',
          description: 'Version 1.0.0 • Built with Expo',
          type: 'button',
          onPress: () => Alert.alert('About', 'Link Aggregator v1.0.0\n\nA React Native app for collecting and organizing links.'),
        },
        {
          icon: 'star',
          label: 'Rate App',
          description: 'Leave a review on the app store',
          type: 'button',
          onPress: () => Alert.alert('Rate App', 'Thank you for using our app!'),
        },
        {
          icon: 'mail',
          label: 'Contact Support',
          description: 'Get help or send feedback',
          type: 'button',
          onPress: () => Alert.alert('Contact', 'Email: support@example.com'),
        },
        {
          icon: 'github',
          label: 'GitHub',
          description: 'View source code on GitHub',
          type: 'button',
          onPress: () => Alert.alert('GitHub', 'The source code will be available on GitHub.'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1">
        <View className="px-4 pt-4 pb-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Settings
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              Customize your link aggregator experience
            </Text>
          </View>

          {/* Stats Card */}
          <View className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 mb-8">
            <Text className="text-white text-lg font-semibold mb-4">
              Your Collection
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">{links.length}</Text>
                <Text className="text-white/80">Total Links</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">
                  {links.filter(l => l.favorite).length}
                </Text>
                <Text className="text-white/80">Favorites</Text>
              </View>
              <View className="items-center">
                <Text className="text-white text-3xl font-bold">
                  {new Set(links.flatMap(l => l.tags)).size}
                </Text>
                <Text className="text-white/80">Unique Tags</Text>
              </View>
            </View>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} className="mb-8">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </Text>
              
              <View className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    onPress={item.type === 'button' ? item.onPress : undefined}
                    className={`flex-row items-center justify-between px-4 py-4 ${
                      itemIndex < section.items.length - 1 
                        ? 'border-b border-gray-200 dark:border-gray-700' 
                        : ''
                    }`}
                    disabled={item.type !== 'button'}
                  >
                    <View className="flex-row items-center flex-1">
                      <View className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 items-center justify-center mr-3">
                        <Feather 
                          name={item.icon as any} 
                          size={20} 
                          color={item.color || colors.primary[500]} 
                        />
                      </View>
                      <View className="flex-1">
                        <Text 
                          className="font-medium text-gray-900 dark:text-white"
                          style={item.color ? { color: item.color } : undefined}
                        >
                          {item.label}
                        </Text>
                        <Text className="text-sm text-gray-500 dark:text-gray-400">
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    
                    {item.type === 'switch' && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onValueChange}
                        trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
                        thumbColor="white"
                      />
                    )}
                    
                    {item.type === 'button' && (
                      <Feather name="chevron-right" size={20} color={colors.neutral[400]} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Danger Zone */}
          <View className="mb-8">
            <Text className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </Text>
            
            <View className="bg-red-50 dark:bg-red-900/20 rounded-2xl overflow-hidden">
              <TouchableOpacity
                onPress={handleResetApp}
                className="flex-row items-center justify-between px-4 py-4"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center mr-3">
                    <Feather name="refresh-cw" size={20} color={colors.error} />
                  </View>
                  <View>
                    <Text className="font-medium text-red-600 dark:text-red-400">
                      Reset App Settings
                    </Text>
                    <Text className="text-sm text-red-500 dark:text-red-300">
                      Reset all app preferences to defaults
                    </Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
          </View>

          {/* App Version */}
          <View className="items-center mt-8">
            <Text className="text-gray-500 dark:text-gray-400">
              Link Aggregator v1.0.0
            </Text>
            <Text className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Made with ❤️ using React Native & Expo
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}