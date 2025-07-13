"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  heading: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export function ResponsiveModal({
  open,
  onOpenChange,
  heading,
  description,
  children,
  footer,
  showCloseButton = false,
  className = "",
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent
          className={`bg-white dark:bg-black/95 border-gray-200 dark:border-white/10 z-[101] max-h-[90vh] flex flex-col ${className}`}
        >
          <DrawerHeader className='text-left flex-shrink-0'>
            <DrawerTitle className='text-gray-900 dark:text-white'>
              {heading}
            </DrawerTitle>
            {description && (
              <DrawerDescription className='text-gray-600 dark:text-gray-400'>
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className='flex-1 p-4 pt-0 overflow-y-auto'>{children}</div>
          {(footer || showCloseButton) && (
            <DrawerFooter className='flex-shrink-0'>
              {footer}
              {showCloseButton && (
                <DrawerClose asChild>
                  <button className='w-full py-2 px-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'>
                    Close
                  </button>
                </DrawerClose>
              )}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`bg-white dark:bg-black/95 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white z-[101] ${className}`}
      >
        <DialogHeader>
          <DialogTitle className='text-gray-900 dark:text-white'>
            {heading}
          </DialogTitle>
          {description && (
            <DialogDescription className='text-gray-600 dark:text-gray-400'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
