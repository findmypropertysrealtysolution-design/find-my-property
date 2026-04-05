import type { useToast } from "@/hooks/use-toast";

type ToastFn = ReturnType<typeof useToast>["toast"];

export function toastSuccess(toast: ToastFn, title: string, description?: string) {
  toast({
    variant: "success",
    title,
    description,
  });
}

export function toastError(toast: ToastFn, title: string, description?: string) {
  toast({
    variant: "destructive",
    title,
    description: description ?? "Something went wrong. Please try again.",
  });
}
