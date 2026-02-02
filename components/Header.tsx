'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import CreateCollectionDialog from './collection/CreateCollectionDialog';
import UserButton from './UserButton';

interface User {
  id: string;
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
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href={`/${locale}`} className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all">
              {t('appName')}
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href={`/${locale}`} 
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t('home')}
              </Link>
              <Link 
                href={`/${locale}/collections`} 
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                {t('collections')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Create Collection Button - only show when logged in */}
            {user && <CreateCollectionDialog locale={locale} />}

            {/* Language switcher */}
            <div className="flex items-center space-x-2">
              <Link
                href="/en"
                className={`px-2 py-1 rounded ${
                  locale === 'en' ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                EN
              </Link>
              <Link
                href="/zh"
                className={`px-2 py-1 rounded ${
                  locale === 'zh' ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'
                }`}
              >
                中文
              </Link>
            </div>

            {/* User button */}
            <UserButton user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
