import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Link } from '@/types/link';
import { colors } from '@/constants';
import { formatDistanceToNow } from 'date-fns';

interface LinkCardProps {
  link: Link;
  onPress?: () => void;
  showActions?: boolean;
}

export default function LinkCard({ link, onPress, showActions = true }: LinkCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const timeAgo = formatDistanceToNow(new Date(link.createdAt), { addSuffix: true });

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-3 shadow-sm">
        <View className="flex-row">
          {/* Link metadata */}
          <View className="flex-1">
            {/* Header with title and favorite */}
            <View className="flex-row justify-between items-start mb-2">
              <Text 
                className="font-semibold text-gray-900 dark:text-white flex-1 mr-2" 
                numberOfLines={2}
              >
                {link.title}
              </Text>
              {link.favorite && (
                <Feather name="heart" size={16} color={colors.error} fill={colors.error} />
              )}
            </View>

            {/* URL and domain */}
            <Text className="text-primary-500 dark:text-primary-400 text-sm mb-2" numberOfLines={1}>
              {getDomainFromUrl(link.url)}
            </Text>

            {/* Description */}
            {link.description && (
              <Text className="text-gray-600 dark:text-gray-300 text-sm mb-3" numberOfLines={2}>
                {link.description}
              </Text>
            )}

            {/* Tags */}
            {link.tags.length > 0 && (
              <View className="flex-row flex-wrap mb-3">
                {link.tags.slice(0, 3).map((tag, index) => (
                  <View
                    key={index}
                    className="bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded mr-2 mb-1"
                  >
                    <Text className="text-primary-700 dark:text-primary-300 text-xs">
                      {tag}
                    </Text>
                  </View>
                ))}
                {link.tags.length > 3 && (
                  <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    <Text className="text-gray-600 dark:text-gray-400 text-xs">
                      +{link.tags.length - 3}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Footer with metadata */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Feather name="clock" size={12} color={colors.neutral[500]} />
                <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                  {timeAgo}
                </Text>
                {link.folder && (
                  <>
                    <Text className="text-gray-500 dark:text-gray-400 mx-2">•</Text>
                    <Feather name="folder" size={12} color={colors.neutral[500]} />
                    <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                      {link.folder}
                    </Text>
                  </>
                )}
              </View>
              
              {link.archived && (
                <View className="flex-row items-center">
                  <Feather name="archive" size={12} color={colors.neutral[500]} />
                  <Text className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                    Archived
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Thumbnail image (if available) */}
          {link.metadata?.image && (
            <View className="ml-4">
              <Image
                source={{ uri: link.metadata.image }}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Actions row (optional) */}
        {showActions && (
          <View className="flex-row justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <TouchableOpacity className="flex-row items-center">
              <Feather name="external-link" size={14} color={colors.neutral[600]} />
              <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">Open</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center">
              <Feather name="share-2" size={14} color={colors.neutral[600]} />
              <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center">
              <Feather name="copy" size={14} color={colors.neutral[600]} />
              <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">Copy</Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-row items-center">
              <Feather name="more-horizontal" size={14} color={colors.neutral[600]} />
              <Text className="text-gray-600 dark:text-gray-400 text-sm ml-2">More</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}