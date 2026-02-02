import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard';
import { RootStackParamList } from '../navigation';
import { colors } from '@/constants';
import { useLinkStore } from '@/stores';
import { format } from 'date-fns';

type LinkDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;
type LinkDetailScreenRouteProp = RouteProp<RootStackParamList, 'LinkDetail'>;

export default function LinkDetailScreen() {
  const navigation = useNavigation<LinkDetailScreenNavigationProp>();
  const route = useRoute<LinkDetailScreenRouteProp>();
  const { linkId } = route.params;
  
  const { getLinkById, updateLink, deleteLink } = useLinkStore();
  const link = getLinkById(linkId);
  
  const [isEditing, setIsEditing] = useState(false);

  if (!link) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <Feather name="alert-circle" size={64} color={colors.error} />
        <Text className="text-xl font-bold text-gray-900 dark:text-white mt-6">
          Link not found
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-6 bg-primary-500 py-3 px-6 rounded-full"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleOpenLink = async () => {
    try {
      await WebBrowser.openBrowserAsync(link.url);
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const handleShareLink = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync({
          message: `${link.title}\n\n${link.url}\n\n${link.description || ''}`,
          url: link.url,
        });
      } else {
        await Clipboard.setStringAsync(`${link.title}\n${link.url}`);
        Alert.alert('Link copied', 'Link has been copied to clipboard');
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(link.url);
    Alert.alert('Copied', 'Link copied to clipboard');
  };

  const handleToggleFavorite = () => {
    updateLink(link.id, { favorite: !link.favorite });
  };

  const handleToggleArchive = () => {
    updateLink(link.id, { archived: !link.archived });
  };

  const handleEditLink = () => {
    setIsEditing(true);
    // In a real app, you would navigate to an edit screen or show a modal
    Alert.alert('Edit Link', 'Edit functionality will be implemented in the next version.');
  };

  const handleDeleteLink = () => {
    Alert.alert(
      'Delete Link',
      'Are you sure you want to delete this link?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteLink(link.id);
            navigation.goBack();
          }
        },
      ]
    );
  };

  const actionButtons = [
    {
      icon: 'external-link',
      label: 'Open',
      color: colors.primary[500],
      onPress: handleOpenLink,
    },
    {
      icon: link.favorite ? 'heart' : 'heart',
      label: link.favorite ? 'Favorited' : 'Favorite',
      color: link.favorite ? colors.error : colors.neutral[500],
      onPress: handleToggleFavorite,
      filled: link.favorite,
    },
    {
      icon: 'share-2',
      label: 'Share',
      color: colors.secondary[500],
      onPress: handleShareLink,
    },
    {
      icon: 'copy',
      label: 'Copy',
      color: colors.neutral[500],
      onPress: handleCopyLink,
    },
  ];

  const metaButtons = [
    {
      icon: 'edit',
      label: 'Edit',
      onPress: handleEditLink,
    },
    {
      icon: link.archived ? 'package' : 'archive',
      label: link.archived ? 'Unarchive' : 'Archive',
      onPress: handleToggleArchive,
    },
    {
      icon: 'trash-2',
      label: 'Delete',
      color: colors.error,
      onPress: handleDeleteLink,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1">
        {/* Header with back button */}
        <View className="px-4 pt-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-6"
          >
            <Feather name="arrow-left" size={24} color={colors.text.light.primary} />
            <Text className="ml-2 text-gray-900 dark:text-white">Back</Text>
          </TouchableOpacity>
        </View>

        {/* Link Content */}
        <View className="px-4">
          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {link.title}
          </Text>

          {/* URL */}
          <TouchableOpacity onPress={handleOpenLink}>
            <Text className="text-primary-500 dark:text-primary-400 mb-4" numberOfLines={1}>
              {link.url}
            </Text>
          </TouchableOpacity>

          {/* Description */}
          {link.description && (
            <View className="mb-6">
              <Text className="text-gray-700 dark:text-gray-300">
                {link.description}
              </Text>
            </View>
          )}

          {/* Metadata */}
          <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Link Information
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-500 dark:text-gray-400">Added</Text>
                <Text className="text-gray-900 dark:text-white">
                  {format(new Date(link.createdAt), 'MMM dd, yyyy')}
                </Text>
              </View>
              
              <View className="flex-row justify-between">
                <Text className="text-gray-500 dark:text-gray-400">Updated</Text>
                <Text className="text-gray-900 dark:text-white">
                  {format(new Date(link.updatedAt), 'MMM dd, yyyy')}
                </Text>
              </View>
              
              {link.folder && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-500 dark:text-gray-400">Folder</Text>
                  <Text className="text-gray-900 dark:text-white">{link.folder}</Text>
                </View>
              )}
              
              <View className="flex-row justify-between">
                <Text className="text-gray-500 dark:text-gray-400">Status</Text>
                <View className="flex-row items-center">
                  {link.favorite && (
                    <View className="flex-row items-center mr-3">
                      <Feather name="heart" size={14} color={colors.error} />
                      <Text className="text-gray-900 dark:text-white ml-1">Favorite</Text>
                    </View>
                  )}
                  {link.archived && (
                    <View className="flex-row items-center">
                      <Feather name="archive" size={14} color={colors.neutral[500]} />
                      <Text className="text-gray-900 dark:text-white ml-1">Archived</Text>
                    </View>
                  )}
                  {!link.favorite && !link.archived && (
                    <Text className="text-gray-900 dark:text-white">Active</Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Tags */}
          {link.tags.length > 0 && (
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap">
                {link.tags.map((tag, index) => (
                  <View
                    key={index}
                    className="bg-primary-100 dark:bg-primary-900/30 px-3 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-primary-700 dark:text-primary-300 text-sm">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {actionButtons.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.onPress}
                  className="items-center w-1/4 mb-4"
                >
                  <View className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center mb-2">
                    <Feather 
                      name={action.icon as any} 
                      size={24} 
                      color={action.color} 
                      fill={action.filled ? action.color : 'none'}
                    />
                  </View>
                  <Text className="text-xs text-center text-gray-700 dark:text-gray-300">
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <View className="flex-row justify-between">
          {metaButtons.map((action, index) => (
            <TouchableOpacity
              key={index}
              onPress={action.onPress}
              className={`flex-row items-center px-4 py-2 rounded-lg ${
                action.label === 'Delete' 
                  ? 'bg-red-50 dark:bg-red-900/20' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}
            >
              <Feather 
                name={action.icon as any} 
                size={16} 
                color={action.color || colors.neutral[600]} 
              />
              <Text 
                className={`ml-2 ${
                  action.label === 'Delete' 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}