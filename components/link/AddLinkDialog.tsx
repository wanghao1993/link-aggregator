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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
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
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus data-icon="inline-start" />
        Add Link
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

            <div className="px-6 py-4">
              <FieldGroup>
                {/* URL */}
                <Field>
                  <FieldLabel htmlFor="url">URL</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      {...register('url')}
                      disabled={isLoading}
                      aria-invalid={!!errors.url}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleFetchMetadata}
                      disabled={!url || isFetchingMetadata || isLoading}
                      variant="outline"
                      size="sm"
                    >
                      {isFetchingMetadata ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Fetch'
                      )}
                    </Button>
                  </div>
                  {errors.url && (
                    <p className="text-xs text-destructive mt-1">{errors.url.message}</p>
                  )}
                </Field>

                {/* Title */}
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    placeholder="Link title"
                    {...register('title')}
                    disabled={isLoading}
                    aria-invalid={!!errors.title}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
                  )}
                </Field>

                {/* Description */}
                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the link..."
                    rows={3}
                    {...register('description')}
                    disabled={isLoading}
                    aria-invalid={!!errors.description}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
                  )}
                </Field>

                {/* Status */}
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        value=""
                        {...register('status')}
                        defaultChecked
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span>None</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        value="used"
                        {...register('status')}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span>✓ I've used this</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        value="later"
                        {...register('status')}
                        disabled={isLoading}
                        className="w-4 h-4"
                      />
                      <span>⏰ Read later</span>
                    </label>
                  </div>
                </Field>
              </FieldGroup>
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
