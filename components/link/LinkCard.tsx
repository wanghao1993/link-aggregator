'use client';

import { ExternalLink, Check, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
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
    <Card className="group transition-all hover:shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Favicon */}
          <Avatar className="h-10 w-10 shrink-0 rounded-md">
            {favicon ? (
              <img src={favicon} alt="" className="rounded-md" />
            ) : (
              <AvatarFallback className="bg-muted rounded-md">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link"
            >
              <h3 className="font-medium text-sm text-foreground group-hover/link:text-primary transition-colors line-clamp-1">
                {title}
              </h3>
            </a>
            
            {description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {description}
              </p>
            )}

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary truncate inline-block mt-1.5"
            >
              {new URL(url).hostname}
            </a>
          </div>

          {/* Status buttons */}
          <div className="shrink-0 flex gap-1">
            <Button
              size="icon-sm"
              variant={status === 'used' ? 'default' : 'outline'}
              onClick={() => handleStatusClick('used')}
              title="I've used this"
            >
              <Check className="h-3 w-3" />
            </Button>
            <Button
              size="icon-sm"
              variant={status === 'later' ? 'secondary' : 'outline'}
              onClick={() => handleStatusClick('later')}
              title="Read later"
            >
              <Clock className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
