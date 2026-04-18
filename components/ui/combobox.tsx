"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ComboboxOption {
  value: string;
  label: string;
  /** Optional secondary text shown below the label in the list. */
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  // Accept readonly arrays so `as const` tuples from option constants slot in
  // without callers having to spread or cast them.
  options: readonly ComboboxOption[];
  value?: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Hide the search input when the list is short. */
  disableSearch?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  disabled?: boolean;
  /** Mirrors aria-invalid on the trigger so shadcn's form.tsx can style it red. */
  "aria-invalid"?: boolean;
  id?: string;
}

/**
 * Accessible single-select combobox.
 *
 * Uses Radix `Popover` (non-modal) instead of Radix `Select` (modal). The
 * non-modal popover does **not** lock body scroll when it opens, so the page
 * scrollbar stays put — fixing the "scrollbar disappears + fixed chrome jumps"
 * behavior you get from `<Select>`.
 *
 * Behaviour:
 * - Keyboard: ↑/↓ to navigate, Enter to select, Esc to close.
 * - Typing filters the list via cmdk's built-in fuzzy matcher.
 * - Trigger visually matches `SelectTrigger` so swapping in existing forms is
 *   seamless.
 */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select…",
      searchPlaceholder = "Search…",
      emptyMessage = "No results found.",
      disableSearch = false,
      className,
      triggerClassName,
      contentClassName,
      disabled,
      id,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const selected = React.useMemo(
      () => options.find((o) => o.value === value),
      [options, value],
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={rest["aria-invalid"]}
            disabled={disabled}
            className={cn(
              // Match SelectTrigger sizing so the field lines up with sibling
              // inputs in a form row.
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm font-normal ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              !selected && "text-muted-foreground",
              className,
              triggerClassName,
            )}
          >
            <span className="truncate">
              {selected ? selected.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn(
            // Width matches the trigger so the list visually anchors under it.
            "w-[var(--radix-popover-trigger-width)] p-0",
            contentClassName,
          )}
        >
          <Command>
            {disableSearch ? null : (
              <CommandInput placeholder={searchPlaceholder} />
            )}
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    // `value` here drives cmdk's search index, so include the
                    // human label to make text search work as users expect.
                    value={`${opt.label} ${opt.value}`}
                    disabled={opt.disabled}
                    onSelect={() => {
                      onValueChange(opt.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{opt.label}</span>
                      {opt.description ? (
                        <span className="truncate text-xs text-muted-foreground">
                          {opt.description}
                        </span>
                      ) : null}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

Combobox.displayName = "Combobox";
