'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-lg mx-4">
        {children}
      </div>
    </div>
  );
}

interface DialogContentProps {
  children: React.ReactNode;
  onClose?: () => void;
}

export function DialogContent({ children, onClose }: DialogContentProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-5 w-5" />
        </button>
      )}
      {children}
    </div>
  );
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

export function DialogHeader({ children }: DialogHeaderProps) {
  return <div className="px-6 pt-6 pb-4">{children}</div>;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

export function DialogTitle({ children }: DialogTitleProps) {
  return <h2 className="text-2xl font-semibold">{children}</h2>;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-gray-600 mt-2">{children}</p>;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return (
    <div className="px-6 pb-6 pt-4 flex justify-end gap-3 border-t">
      {children}
    </div>
  );
}
