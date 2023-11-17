"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="2xl:h-[100px] 2xl:p-8">
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="2xl: text-base">{title}</ToastTitle>
              )}
              {description && (
                <ToastDescription className="2xl: !text-base">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport className="2xl:mr-[2%] 2xl: mb-[1%]" />
    </ToastProvider>
  );
}
