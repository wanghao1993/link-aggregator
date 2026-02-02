'use client';

import { ExternalLink, Check, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface LinkCardProps {
  id: string;
  url: string;
  title: string;
  description?: string | null;
  favicon?: string | null;
  status?: string | null;
  onStatusChange?: (linkId: string, status: 'used' | 'later' | null) => void;
}

export default function LinkCard({
  id,
  url,
  title,
  description,
  favicon,
  status,
  onStatusChange,
}: LinkCardProps) {
  const handleStatusClick = (newStatus: 'used' | 'later') => {
    if (onStatusChange) {
      onStatusChange(id, status === newStatus ? null : newStatus);
    }
  };

  return (
    <Card className="group transition-all hover:shadow-md">
      <CardContent className="p-5">
      <div className="flex items-start space-x-4">
        {/* Favicon */}
        <Avatar className="h-10 w-10 flex-shrink-0">
          {favicon ? (
            <img src={favicon} alt="" className="rounded" />
          ) : (
            <AvatarFallback className="bg-muted">
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          )}
        </Avatar>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link"
          >
            <h3 className="font-semibold text-foreground group-hover/link:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
          </a>
          
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground hover:text-primary truncate inline-block mt-2"
          >
            {new URL(url).hostname}
          </a>
        </div>

        {/* Status buttons */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <Button
            size="icon"
            variant={status === 'used' ? 'default' : 'outline'}
            onClick={() => handleStatusClick('used')}
            title="I've used this"
            className={status === 'used' ? 'bg-green-500 hover:bg-green-600' : ''}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant={status === 'later' ? 'default' : 'outline'}
            onClick={() => handleStatusClick('later')}
            title="Read later"
            className={status === 'later' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
          >
            <Clock className="h-4 w-4" />
          </Button>
        </div>
      </div>
      </CardContent>
    </Card>
  );
}
