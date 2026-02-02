'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface CollectionCardProps {
  id: string;
  title: string;
  description?: string | null;
  slug: string;
  author: {
    name?: string | null;
    image?: string | null;
  };
  linkCount: number;
  updatedAt: Date;
}

export default function CollectionCard({
  title,
  description,
  slug,
  author,
  linkCount,
  updatedAt,
}: CollectionCardProps) {
  const params = useParams();
  const locale = params.locale as string;

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'just now';
  };

  return (
    <Link href={`/${locale}/c/${slug}`} className="block h-full">
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1 group">
        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="line-clamp-3 leading-relaxed">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={author.image || undefined} alt={author.name || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs font-semibold">
                {(author.name || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{author.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {linkCount} links
            </Badge>
            <span className="text-xs text-muted-foreground">{timeAgo(updatedAt)}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
