'use client';

import * as React from 'react';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </BaseDialog.Root>
  );
}

interface DialogTriggerProps {
  children: React.ReactNode;
}

export function DialogTrigger({ children }: DialogTriggerProps) {
  return <BaseDialog.Trigger>{children}</BaseDialog.Trigger>;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  showClose?: boolean;
  fullScreen?: boolean;
}

export function DialogContent({
  children,
  className = '',
  title,
  description,
  showClose = true,
  fullScreen = false,
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop
        className="
          fixed inset-0 z-50
          bg-black/70 backdrop-blur-sm
          transition-opacity duration-200
          data-starting-style:opacity-0
          data-ending-style:opacity-0
        "
      />
      <BaseDialog.Popup
        className={`
          fixed z-50
          bg-highlight-yellow text-royal-blue
          shadow-2xl
          flex flex-col

          ${fullScreen ? `
            inset-0
            transition-opacity duration-200
            data-starting-style:opacity-0
            data-ending-style:opacity-0
          ` : `
            bottom-0 left-0 right-0
            max-md:rounded-t-3xl
            max-md:max-h-[85vh]

            md:bottom-auto md:right-auto
            md:top-[50%] md:left-[50%]
            md:translate-x-[-50%] md:translate-y-[-50%]
            md:max-w-2xl md:w-full
            md:rounded-2xl
            md:max-h-[90vh]

            overflow-hidden

            transition-all duration-200

            opacity-100
            data-starting-style:opacity-0
            data-ending-style:opacity-0

            max-md:translate-y-0
            max-md:data-starting-style:translate-y-full
            max-md:data-ending-style:translate-y-full

            md:scale-100
            md:data-starting-style:scale-95
            md:data-ending-style:scale-95
          `}

          ${className}
        `}
      >
        <div className={fullScreen ? "p-8 md:p-16 flex items-center justify-center min-h-dvh" : "flex-1 min-h-0 overflow-y-auto p-6 md:p-8"}>
          {/* Close button */}
          {showClose && (
            <BaseDialog.Close
              className="
                absolute top-4 right-4
                text-royal-blue hover:text-royal-blue-dark
                transition-colors
                p-2 rounded-full
                hover:bg-royal-blue/10
              "
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </BaseDialog.Close>
          )}

          {/* Title */}
          {title && (
            <BaseDialog.Title className="font-serif text-3xl md:text-4xl text-royal-blue mb-6">
              {title}
            </BaseDialog.Title>
          )}

          {/* Description (optional, hidden by default) */}
          {description && (
            <BaseDialog.Description className="sr-only">
              {description}
            </BaseDialog.Description>
          )}

          {/* Content */}
          {children}
        </div>
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

Dialog.Trigger = DialogTrigger;
Dialog.Content = DialogContent;
