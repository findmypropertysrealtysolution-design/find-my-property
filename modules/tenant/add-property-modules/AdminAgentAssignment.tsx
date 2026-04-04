"use client";

import { useFormContext } from "react-hook-form";
import { UserCog, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAgents } from "@/hooks/use-agents";
import type { PropertyFormValues } from "./schema";

/** Admin-only: assign which agent owns / manages this listing. */
export const AdminAgentAssignment = () => {
  const { control } = useFormContext<PropertyFormValues>();
  const { data: agents, isLoading } = useAgents();

  const options = agents?.filter((a) => a.isEmailVerified || a.isPhoneVerified) ?? [];
  const NONE = "__none__";

  return (
    <div className="space-y-4 pb-2">
      <p className="text-sm text-muted-foreground flex items-start gap-2">
        <UserCog className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        Choose the listing agent for this property. Tenants do not see this section.
      </p>
      <FormField
        control={control}
        name="assignedAgentId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Listing agent</FormLabel>
            <Select
              onValueChange={(v) => field.onChange(v === NONE ? "" : v)}
              value={field.value ? String(field.value) : NONE}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={isLoading ? "Loading agents…" : "Select an agent"} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={NONE}>— None —</SelectItem>
                {options.map((agent) => (
                  <SelectItem key={agent.id} value={String(agent.id)}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Optional. Leave empty to assign later from approvals.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading agent list…
        </div>
      )}
    </div>
  );
};
