"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, isValid, parse, startOfDay } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * Wire format used when talking to the form / API layer.
 * Matches the existing `preferredDate: string` contract so the backend DTO,
 * the Zod schema and every consumer keeps working with zero changes.
 */
const WIRE_FORMAT = "yyyy-MM-dd";

export interface DatePickerProps {
  /** ISO `yyyy-MM-dd` string or empty. */
  value?: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Earliest selectable day (inclusive). Days before this are greyed out. */
  minDate?: Date;
  /** Latest selectable day (inclusive). */
  maxDate?: Date;
  className?: string;
  id?: string;
  /** Forwarded to the trigger so shadcn's form helpers can style invalid fields red. */
  "aria-invalid"?: boolean;
}

/**
 * Single-date picker that matches the rest of the form chrome (same height /
 * border / focus ring as `<Input>` and `<Combobox>`).
 *
 * Uses a non-modal `Popover`, so opening the calendar does **not** lock the
 * page scrollbar — avoids the same layout-shift bug that killed `<Select>`.
 *
 * Emits a plain `yyyy-MM-dd` string (or `""` when cleared) so it drops into
 * existing RHF fields that were previously bound to `<input type="date">`.
 */
export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      value,
      onValueChange,
      placeholder = "Pick a date",
      disabled,
      minDate,
      maxDate,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const parsed = React.useMemo(() => {
      if (!value) return undefined;
      const d = parse(value, WIRE_FORMAT, new Date());
      return isValid(d) ? d : undefined;
    }, [value]);

    // react-day-picker accepts a predicate for `disabled`; combine both bounds
    // so callers can restrict past-only / future-only without composing their
    // own matcher.
    const disabledMatcher = React.useMemo(() => {
      if (!minDate && !maxDate) return undefined;
      const min = minDate ? startOfDay(minDate) : undefined;
      const max = maxDate ? startOfDay(maxDate) : undefined;
      return (date: Date) => {
        const d = startOfDay(date);
        if (min && d < min) return true;
        if (max && d > max) return true;
        return false;
      };
    }, [minDate, maxDate]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={rest["aria-invalid"]}
            className={cn(
              "flex h-10 w-full items-center justify-start gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-normal ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              !parsed && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="h-4 w-4 shrink-0 opacity-60" />
            <span className="truncate">
              {parsed ? format(parsed, "PPP") : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={parsed}
            onSelect={(date) => {
              onValueChange(date ? format(date, WIRE_FORMAT) : "");
              setOpen(false);
            }}
            disabled={disabledMatcher}
            defaultMonth={parsed ?? minDate ?? new Date()}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  },
);
DatePicker.displayName = "DatePicker";
