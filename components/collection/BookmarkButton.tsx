'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BookmarkButtonProps {
  collectionId: string;
  isBookmarked: boolean;
  isAuthenticated: boolean;
}

export default function BookmarkButton({
  collectionId,
  isBookmarked: initialIsBookmarked,
  isAuthenticated,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    try {
      setIsLoading(true);

      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(
          `/api/bookmarks/collections?collectionId=${collectionId}`,
          { method: 'DELETE' }
        );

        if (!response.ok) throw new Error('Failed to remove bookmark');
        setIsBookmarked(false);
      } else {
        // Add bookmark
        const response = await fetch('/api/bookmarks/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collectionId }),
        });

        if (!response.ok) throw new Error('Failed to bookmark');
        setIsBookmarked(true);
      }

      router.refresh();
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBookmark}
      disabled={isLoading}
      variant={isBookmarked ? 'default' : 'outline'}
      className="flex items-center space-x-2"
    >
      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
      <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
    </Button>
  );
}
