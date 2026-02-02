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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
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
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus data-icon="inline-start" />
        Create
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

            <div className="px-6 py-4">
              <FieldGroup>
                {/* Title */}
                <Field>
                  <FieldLabel htmlFor="title">Title</FieldLabel>
                  <Input
                    id="title"
                    placeholder="e.g., AI & ML Resources"
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
                    placeholder="Describe what this collection is about..."
                    rows={4}
                    {...register('description')}
                    disabled={isLoading}
                    aria-invalid={!!errors.description}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive mt-1">{errors.description.message}</p>
                  )}
                </Field>

                {/* Public/Private */}
                <Field orientation="horizontal" className="items-center">
                  <input
                    type="checkbox"
                    id="isPublic"
                    {...register('isPublic')}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-input"
                  />
                  <FieldLabel htmlFor="isPublic" className="mb-0!">
                    Make this collection public
                  </FieldLabel>
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
