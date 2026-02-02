import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import * as Clipboard from 'expo-clipboard';
import * as WebBrowser from 'expo-web-browser';
import { colors } from '@/constants';
import { useLinkStore } from '@/stores';

const linkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
  folder: z.string().optional(),
  favorite: z.boolean().default(false),
});

type LinkFormData = z.infer<typeof linkSchema>;

export default function AddLinkScreen() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { addLink } = useLinkStore();
  
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
      tags: '',
      folder: '',
      favorite: false,
    },
  });

  const handlePasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setValue('url', text);
        // Optionally fetch metadata from URL
      }
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleFetchMetadata = async () => {
    const url = watch('url');
    if (!url) return;

    try {
      setIsLoading(true);
      // In a real app, you would fetch metadata from the URL
      // For now, we'll just set a placeholder title
      setValue('title', 'Fetched from URL');
      setValue('description', 'Description fetched from website metadata');
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch metadata from URL');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: LinkFormData) => {
    const tags = data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
    
    addLink({
      ...data,
      tags,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      archived: false,
    });

    Alert.alert('Success', 'Link added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Add New Link
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Save links from anywhere on the web
          </Text>
        </View>

        {/* URL Input */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
              URL *
            </Text>
            <TouchableOpacity onPress={handlePasteFromClipboard}>
              <Text className="text-primary-500 dark:text-primary-400">
                Paste from clipboard
              </Text>
            </TouchableOpacity>
          </View>
          
          <Controller
            control={control}
            name="url"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border ${errors.url ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                placeholder="https://example.com"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            )}
          />
          {errors.url && (
            <Text className="text-red-500 text-sm mt-1">{errors.url.message}</Text>
          )}
          
          <TouchableOpacity
            onPress={handleFetchMetadata}
            disabled={isLoading}
            className="mt-3 flex-row items-center"
          >
            <Feather name="download" size={16} color={colors.primary[500]} />
            <Text className="text-primary-500 dark:text-primary-400 ml-2">
              {isLoading ? 'Fetching metadata...' : 'Fetch metadata from URL'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title *
          </Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                placeholder="Enter link title"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.title && (
            <Text className="text-red-500 text-sm mt-1">{errors.title.message}</Text>
          )}
        </View>

        {/* Description Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholder="Enter description"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
                multiline
                numberOfLines={3}
              />
            )}
          />
        </View>

        {/* Tags Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags (comma separated)
          </Text>
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholder="webdev, tutorial, react"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Folder Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Folder
          </Text>
          <Controller
            control={control}
            name="folder"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                placeholder="General"
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        {/* Favorite Toggle */}
        <View className="mb-8">
          <Controller
            control={control}
            name="favorite"
            render={({ field: { onChange, value } }) => (
              <TouchableOpacity
                onPress={() => onChange(!value)}
                className="flex-row items-center"
              >
                <View className={`w-6 h-6 rounded-full border-2 ${value ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-gray-700'} mr-3 items-center justify-center`}>
                  {value && <Feather name="check" size={14} color="white" />}
                </View>
                <Text className="text-gray-700 dark:text-gray-300">
                  Mark as favorite
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-primary-500 py-4 rounded-lg mb-8"
        >
          <Text className="text-white font-semibold text-center">
            Save Link
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}