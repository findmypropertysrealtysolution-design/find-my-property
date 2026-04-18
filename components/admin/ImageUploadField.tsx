"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

/**
 * Drag-and-drop image uploader used by the admin settings page for logo and
 * favicon fields. Shows a live preview of `value` (a fully-qualified URL), a
 * skeleton while uploading, and a destructive "remove" action.
 *
 * Kept generic on purpose so we can drop it into other settings surfaces later
 * (e.g. email template branding, hero overrides) without copying this wiring.
 */
export interface ImageUploadFieldProps {
  /** Current stored URL — `null`/empty means no image. */
  value: string | null | undefined;
  onChange: (nextUrl: string | null) => void;
  label: string;
  description?: string;
  /** Accept list, e.g. `"image/png,image/jpeg,image/svg+xml,image/x-icon"`. */
  accept?: string;
  /** Max file size in MB. Files larger than this are rejected client-side. */
  maxSizeMb?: number;
  /** Visual aspect ratio for the preview tile. */
  aspect?: "square" | "wide";
  /** Disables all interactions. */
  disabled?: boolean;
  className?: string;
}

const MB = 1024 * 1024;

export function ImageUploadField({
  value,
  onChange,
  label,
  description,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon",
  maxSizeMb = 5,
  aspect = "square",
  disabled,
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const inputId = useId();

  const handleFiles = useCallback(
    async (files: FileList | File[] | null) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        toast({
          title: "Unsupported file",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > maxSizeMb * MB) {
        toast({
          title: "File too large",
          description: `Please pick an image under ${maxSizeMb} MB.`,
          variant: "destructive",
        });
        return;
      }

      setIsUploading(true);
      try {
        const { url } = await api.uploadFile(file);
        onChange(url);
      } catch (err) {
        toast({
          title: "Upload failed",
          description:
            err instanceof Error ? err.message : "Please try again in a moment.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [maxSizeMb, onChange, toast],
  );

  // Fixed sizes keep the preview visually calm in both narrow and wide grid
  // columns. A "wide" tile stretches to ~384px for logos with breathing room;
  // a "square" tile (favicons, avatars) stays a crisp 144×144 chip.
  const sizeClass =
    aspect === "wide" ? "h-36 w-full max-w-sm" : "h-36 w-36";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </label>
        {value ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onChange(null)}
            disabled={disabled || isUploading}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Remove
          </Button>
        ) : null}
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-disabled={disabled}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-colors",
          "bg-muted/30 text-muted-foreground",
          "cursor-pointer hover:border-primary/60 hover:bg-primary/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          sizeClass,
          isDragging && "border-primary bg-primary/10 text-primary",
          disabled && "cursor-not-allowed opacity-60",
          !value && "flex items-center justify-center",
        )}
      >
        {value ? (
          <Image
            src={value}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            unoptimized
            className="object-contain p-4"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 px-3 text-center">
            <ImageIcon className="h-5 w-5" aria-hidden />
            <div className="text-xs font-medium text-foreground">
              Drop or click to upload
            </div>
            {description ? (
              <div className="text-[11px] leading-tight text-muted-foreground">
                {description}
              </div>
            ) : null}
          </div>
        )}

        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading…
            </div>
          </div>
        ) : null}

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={disabled || isUploading}
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
        >
          <Upload className="mr-2 h-3.5 w-3.5" />
          {value ? "Replace" : "Upload"}
        </Button>
        {value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-xs text-muted-foreground hover:text-foreground"
          >
            {value}
          </a>
        ) : null}
      </div>
    </div>
  );
}
