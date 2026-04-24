"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

import { cn } from "./utils";

/* ROOT */
function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

/* TRIGGER */
function DialogTrigger(
  props: React.ComponentProps<typeof DialogPrimitive.Trigger>
) {
  return (
    <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
  );
}

/* PORTAL */
function DialogPortal(
  props: React.ComponentProps<typeof DialogPrimitive.Portal>
) {
  return (
    <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
  );
}

/* CLOSE */
function DialogClose(
  props: React.ComponentProps<typeof DialogPrimitive.Close>
) {
  return (
    <DialogPrimitive.Close data-slot="dialog-close" {...props} />
  );
}

/* 🔥 FIXED: OVERLAY WITH forwardRef */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        className
      )}
      {...props}
    />
  );
});
DialogOverlay.displayName = "DialogOverlay";

/* 🔥 FIXED: CONTENT WITH forwardRef */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay />

      <DialogPrimitive.Content
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)]",
          "translate-x-[-50%] translate-y-[-50%]",
          "gap-4 rounded-lg border bg-white p-6 shadow-lg",
          "duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
          "sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}

        {/* CLOSE BUTTON */}
        <DialogPrimitive.Close
          className="absolute top-4 right-4 rounded opacity-70 hover:opacity-100 focus:outline-none"
        >
          <XIcon className="w-4 h-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

/* HEADER */
function DialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2 text-center sm:text-left",
        className
      )}
      {...props}
    />
  );
}

/* FOOTER */
function DialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

/* TITLE */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Title
      ref={ref}
      data-slot="dialog-title"
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

/* DESCRIPTION */
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => {
  return (
    <DialogPrimitive.Description
      ref={ref}
      data-slot="dialog-description"
      className={cn("text-sm text-gray-500", className)}
      {...props}
    />
  );
});
DialogDescription.displayName = "DialogDescription";

/* EXPORTS */
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};