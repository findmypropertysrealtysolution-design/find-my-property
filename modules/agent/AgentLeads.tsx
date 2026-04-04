"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { Mail, Phone, Clock, Loader2, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeads, useUpdateLeadStatus } from "@/hooks/use-leads";
import type { LeadStatus } from "@/lib/api";

const statusOptions: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
  { value: "archived", label: "Archived" },
];

function statusBadgeVariant(status: LeadStatus) {
  if (status === "new") return "default" as const;
  if (status === "contacted") return "secondary" as const;
  return "outline" as const;
}

const AgentLeads = () => {
  const { data: leads, isLoading, isError, error } = useLeads();
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateLeadStatus();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">Leads</h2>
        <p className="text-sm text-muted-foreground">
          Enquiries from tenants interested in your listings
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading leads…</span>
        </div>
      )}

      {isError && (
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex gap-3 text-sm"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-destructive">Could not load leads</p>
            <p className="text-muted-foreground mt-1">
              {(error as Error)?.message || "Check that the backend exposes GET /leads for agents."}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && leads?.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground text-sm">
          No enquiries yet. When tenants request contact on your listings, they will appear here.
        </div>
      )}

      {!isLoading && !isError && leads && leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead, i) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {lead.tenantName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-medium text-foreground text-sm">{lead.tenantName}</h3>
                  <Badge variant={statusBadgeVariant(lead.status)} className="text-[10px]">
                    {lead.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{lead.propertyTitle}</p>
                {lead.message ? (
                  <p className="text-xs text-muted-foreground mt-1 italic line-clamp-2">&ldquo;{lead.message}&rdquo;</p>
                ) : null}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 shrink-0" />
                    {lead.tenantEmail}
                  </span>
                  {lead.tenantPhone ? (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 shrink-0" />
                      {lead.tenantPhone}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                </span>
                <Select
                  value={lead.status}
                  disabled={isUpdating}
                  onValueChange={(value: LeadStatus) => {
                    if (value !== lead.status) {
                      updateStatus({ id: lead.id, status: value });
                    }
                  }}
                >
                  <SelectTrigger className="h-9 w-[140px] text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentLeads;
