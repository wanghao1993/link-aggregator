import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { LinkCard } from '@/components';
import { colors } from '@/constants';
import { useLinkStore } from '@/stores';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { links, folders } = useLinkStore();

  const handleAddLink = () => {
    navigation.navigate('AddLink');
  };

  const handleLinkPress = (linkId: string) => {
    navigation.navigate('LinkDetail', { linkId });
  };

  const renderLinkItem = ({ item }: { item: any }) => (
    <LinkCard link={item} onPress={() => handleLinkPress(item.id)} />
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
      <View className="px-4 pt-4">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              My Links
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              {links.length} links • {folders.length} folders
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleAddLink}
            className="bg-primary-500 p-3 rounded-full"
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Quick stats */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl flex-1 mr-2">
            <Text className="text-primary-700 dark:text-primary-300 font-semibold">
              Favorites
            </Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {links.filter(l => l.favorite).length}
            </Text>
          </View>
          <View className="bg-secondary-50 dark:bg-secondary-900/20 p-4 rounded-xl flex-1 ml-2">
            <Text className="text-secondary-700 dark:text-secondary-300 font-semibold">
              Unread
            </Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {links.filter(l => !l.archived).length}
            </Text>
          </View>
        </View>

        {/* Recent links */}
        <View className="mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Links
            </Text>
            <TouchableOpacity>
              <Text className="text-primary-500 dark:text-primary-400">
                See all
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {links.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-primary-50 dark:bg-primary-900/20 p-6 rounded-2xl items-center">
            <Feather name="link" size={48} color={colors.primary[500]} />
            <Text className="text-xl font-bold text-gray-900 dark:text-white mt-4">
              No links yet
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
              Start by adding your first link. Save articles, videos, and resources you want to remember.
            </Text>
            <TouchableOpacity
              onPress={handleAddLink}
              className="mt-6 bg-primary-500 py-3 px-6 rounded-full"
            >
              <Text className="text-white font-semibold">Add First Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={links.slice(0, 10)}
          renderItem={renderLinkItem}
          keyExtractor={item => item.id}
          contentContainerClassName="px-4 pb-4"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}