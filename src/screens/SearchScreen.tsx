import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { LinkCard } from '@/components';
import { colors } from '@/constants';
import { useLinkStore } from '@/stores';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { links, searchLinks } = useLinkStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(links);
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'unread'>('all');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults(links);
    } else {
      const results = searchLinks(query);
      setSearchResults(results);
    }
  };

  const handleFilterChange = (filter: 'all' | 'favorites' | 'unread') => {
    setActiveFilter(filter);
    let filtered = links;
    
    if (filter === 'favorites') {
      filtered = links.filter(link => link.favorite);
    } else if (filter === 'unread') {
      filtered = links.filter(link => !link.archived);
    }
    
    if (searchQuery.trim() !== '') {
      filtered = searchLinks(searchQuery, filtered);
    }
    
    setSearchResults(filtered);
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
        {/* Search Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Search Links
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            Search through all your saved links
          </Text>
        </View>

        {/* Search Input */}
        <View className="mb-6">
          <View className="flex-row items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
            <Feather name="search" size={20} color={colors.neutral[500]} />
            <TextInput
              className="flex-1 ml-3 text-gray-900 dark:text-white"
              placeholder="Search by title, URL, tags..."
              placeholderTextColor={colors.neutral[500]}
              value={searchQuery}
              onChangeText={handleSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch('')}>
                <Feather name="x" size={20} color={colors.neutral[500]} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Filters */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Quick Filters
          </Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <Text className={`${activeFilter === 'all' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                All ({links.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFilterChange('favorites')}
              className={`px-4 py-2 rounded-full ${activeFilter === 'favorites' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <Text className={`${activeFilter === 'favorites' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                Favorites ({links.filter(l => l.favorite).length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleFilterChange('unread')}
              className={`px-4 py-2 rounded-full ${activeFilter === 'unread' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-800'}`}
            >
              <Text className={`${activeFilter === 'unread' ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                Unread ({links.filter(l => !l.archived).length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Results Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Results ({searchResults.length})
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Feather name="filter" size={16} color={colors.primary[500]} />
            <Text className="text-primary-500 dark:text-primary-400 ml-1">
              Sort
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Results */}
      {searchResults.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="items-center">
            <Feather name="search" size={64} color={colors.neutral[400]} />
            <Text className="text-xl font-bold text-gray-900 dark:text-white mt-6">
              No results found
            </Text>
            <Text className="text-gray-500 dark:text-gray-400 text-center mt-2">
              {searchQuery.trim() === ''
                ? 'Start typing to search your links'
                : `No links found for "${searchQuery}"`}
            </Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderLinkItem}
          keyExtractor={item => item.id}
          contentContainerClassName="px-4 pb-4"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}