'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { createCollectionSchema, type CreateCollectionInput } from '@/lib/validations/collection';

interface CreateCollectionDialogProps {
  locale: string;
}

export default function CreateCollectionDialog({ locale }: CreateCollectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('collection');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCollectionInput>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const onSubmit = async (data: CreateCollectionInput) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create collection');
      }

      const collection = await response.json();
      
      // Close dialog and reset form
      setOpen(false);
      reset();
      
      // Redirect to the new collection
      router.push(`/${locale}/c/${collection.slug}`);
      router.refresh();
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Create Collection</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
              <DialogDescription>
                Create a new collection to organize your favorite links
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 space-y-4">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  placeholder="e.g., AI & ML Resources"
                  {...register('title')}
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe what this collection is about..."
                  rows={4}
                  {...register('description')}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Public/Private */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  {...register('isPublic')}
                  disabled={isLoading}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Make this collection public
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Collection'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
