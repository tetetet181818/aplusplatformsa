"use client";
import { cn } from "@/lib/utils";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import * as React from "react";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group relative pointer-events-auto flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-background border",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive",
        success:
          "bg-green-50 text-green-900 border-green-200 dark:bg-green-900 dark:text-green-50 dark:border-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Toast = React.forwardRef(
  ({ className, variant, dismiss, ...props }, ref) => {
    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(
          toastVariants({ variant }),
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
          "data-[swipe=cancel]:translate-x-0",
          "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
          "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
          "data-[state=closed]:slide-out-to-right-full",
          className
        )}
        {...props} 
      />
    );
  }
);

Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-red-300 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-white",
      "group-[.success]:border-green-300 group-[.success]:hover:bg-green-500 group-[.success]:hover:text-white",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:bg-accent focus:opacity-100 focus:outline-none group-hover:opacity-100",
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50",
      "group-[.success]:text-green-500 group-[.success]:hover:text-green-700",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(
  ({ className, children, variant, ...props }, ref) => (
    <ToastPrimitives.Title
      ref={ref}
      className={cn("text-sm font-semibold flex items-center gap-2", className)}
      {...props}
    >
      {variant === "success" && <CheckCircle className="h-4 w-4" />}
      {variant === "destructive" && <AlertTriangle className="h-4 w-4" />}
      {children}
    </ToastPrimitives.Title>
  )
);
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
