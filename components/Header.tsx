'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import CreateCollectionDialog from './collection/CreateCollectionDialog';
import UserButton from './UserButton';

interface User {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface HeaderProps {
  user?: User | null;
}

export default function Header({ user }: HeaderProps) {
  const t = useTranslations('common');
  const params = useParams();
  const locale = params.locale as string;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link 
              href={`/${locale}`} 
              className="text-lg font-bold text-foreground hover:text-primary transition-colors"
            >
              {t('appName')}
            </Link>
            <Separator orientation="vertical" className="h-6 hidden md:block" />
            <nav className="hidden md:flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}`}>
                  {t('home')}
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/collections`}>
                  {t('collections')}
                </Link>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Create Collection Button - only show when logged in */}
            {user && <CreateCollectionDialog locale={locale} />}

            {/* Language switcher */}
            <div className="flex items-center gap-1">
              <Button
                variant={locale === 'en' ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link href="/en">EN</Link>
              </Button>
              <Button
                variant={locale === 'zh' ? 'secondary' : 'ghost'}
                size="sm"
                asChild
              >
                <Link href="/zh">中文</Link>
              </Button>
            </div>

            {/* User button */}
            <UserButton user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
