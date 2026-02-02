'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/Button';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface UserButtonProps {
  user: User | null;
}

export default function UserButton({ user }: UserButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <Button
        onClick={() => router.push(`/${locale}/auth/signin`)}
        size="sm"
      >
        Sign In
      </Button>
    );
  }

  const handleSignOut = async () => {
    const response = await fetch('/api/auth/signout', {
      method: 'POST',
    });
    if (response.ok) {
      router.push(`/${locale}`);
      router.refresh();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rounded-lg hover:bg-gray-100 p-2 transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
            {(user.name || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          
          <button
            onClick={() => {
              router.push(`/${locale}/me`);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
          >
            <UserIcon className="w-4 h-4" />
            <span>My Page</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}
