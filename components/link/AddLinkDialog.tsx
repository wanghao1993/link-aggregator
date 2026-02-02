'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';
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
import { addLinkSchema, type AddLinkInput } from '@/lib/validations/link';
import { fetchMetadata } from '@/lib/metadata';

interface AddLinkDialogProps {
  collectionId: string;
}

export default function AddLinkDialog({ collectionId }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddLinkInput>({
    resolver: zodResolver(addLinkSchema),
  });

  const url = watch('url');

  const handleFetchMetadata = async () => {
    if (!url) return;

    try {
      setIsFetchingMetadata(true);
      const metadata = await fetchMetadata(url);
      
      setValue('title', metadata.title);
      if (metadata.description) {
        setValue('description', metadata.description);
      }
      if (metadata.favicon) {
        setValue('favicon', metadata.favicon);
      }
    } catch (error) {
      console.error('Error fetching metadata:', error);
      alert('Failed to fetch metadata. Please fill in the details manually.');
    } finally {
      setIsFetchingMetadata(false);
    }
  };

  const onSubmit = async (data: AddLinkInput) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/collections/${collectionId}/links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add link');
      }

      // Close dialog and reset form
      setOpen(false);
      reset();
      
      // Refresh the page to show new link
      router.refresh();
    } catch (error) {
      console.error('Error adding link:', error);
      alert(error instanceof Error ? error.message : 'Failed to add link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="flex items-center space-x-2">
        <Plus className="w-4 h-4" />
        <span>Add Link</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Add Link to Collection</DialogTitle>
              <DialogDescription>
                Add a new link to this collection. Paste a URL to automatically fetch metadata.
              </DialogDescription>
            </DialogHeader>

            <div className="px-6 py-4 space-y-4">
              {/* URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <div className="flex space-x-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    {...register('url')}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    onClick={handleFetchMetadata}
                    disabled={!url || isFetchingMetadata || isLoading}
                    variant="outline"
                  >
                    {isFetchingMetadata ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Fetch'
                    )}
                  </Button>
                </div>
                {errors.url && (
                  <p className="text-sm text-red-600 mt-1">{errors.url.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <Input
                  id="title"
                  placeholder="Link title"
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
                  placeholder="Brief description of the link..."
                  rows={3}
                  {...register('description')}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value=""
                      {...register('status')}
                      defaultChecked
                      disabled={isLoading}
                      className="mr-2"
                    />
                    <span className="text-sm">None</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="used"
                      {...register('status')}
                      disabled={isLoading}
                      className="mr-2"
                    />
                    <span className="text-sm">✓ I've used this</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="later"
                      {...register('status')}
                      disabled={isLoading}
                      className="mr-2"
                    />
                    <span className="text-sm">⏰ Read later</span>
                  </label>
                </div>
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
              <Button type="submit" disabled={isLoading || isFetchingMetadata}>
                {isLoading ? 'Adding...' : 'Add Link'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
