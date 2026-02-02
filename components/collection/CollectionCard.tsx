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
      <Card className="h-full transition-all hover:shadow-md group">
        <CardHeader>
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="line-clamp-3">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardFooter className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-6 w-6 shrink-0">
              <AvatarImage src={author.image || undefined} alt={author.name || 'User'} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {(author.name || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium truncate">{author.name || 'Anonymous'}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary">
              {linkCount}
            </Badge>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {timeAgo(updatedAt)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
