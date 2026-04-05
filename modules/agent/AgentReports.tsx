"use client";

import { useMemo } from "react";
import { BarChart3, Building2, Home, Users } from "lucide-react";
import { useMyProperties } from "@/hooks/use-properties";
import { useLeads } from "@/hooks/use-leads";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { LeadStatus } from "@/lib/api";

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "closed", "archived"];

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
  archived: "Archived",
};

export default function AgentReports() {
  const { data: properties, isLoading: propsLoading, isError: propsError } = useMyProperties();
  const { data: leads, isLoading: leadsLoading, isError: leadsError } = useLeads();

  const listingStats = useMemo(() => {
    const list = properties ?? [];
    const rent = list.filter((p) => p.type === "rent").length;
    const buy = list.filter((p) => p.type === "buy").length;
    return { total: list.length, rent, buy };
  }, [properties]);

  const leadStats = useMemo(() => {
    const list = leads ?? [];
    const byStatus = {
      new: 0,
      contacted: 0,
      closed: 0,
      archived: 0,
    } satisfies Record<LeadStatus, number>;
    for (const l of list) {
      byStatus[l.status] += 1;
    }
    return { total: list.length, byStatus };
  }, [leads]);

  const loading = propsLoading || leadsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[220px] rounded-xl" />
      </div>
    );
  }

  const hasError = propsError || leadsError;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Listing counts and lead pipeline from your account. Add listings and respond to enquiries to see activity
          here.
        </p>
      </div>

      {hasError ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Something went wrong loading reports. Refresh the page or try again later.
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total listings</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-3xl font-semibold tabular-nums">{listingStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rent listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-3xl font-semibold tabular-nums">{listingStats.rent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sale listings</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-3xl font-semibold tabular-nums">{listingStats.buy}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
          </CardHeader>
          <CardContent>
            <p className="font-heading text-3xl font-semibold tabular-nums">{leadStats.total}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
            <div>
              <CardTitle className="font-heading text-lg">Lead conversion</CardTitle>
              <CardDescription>Leads by status (from enquiries on your listings)</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {leadStats.total === 0 ? (
            <p className="text-sm text-muted-foreground">
              No leads yet. When tenants submit enquiries on your properties, they will appear here with status
              tracking.
            </p>
          ) : (
            <ul className="space-y-4">
              {LEAD_STATUSES.map((status) => {
                const count = leadStats.byStatus[status];
                const pct = Math.round((count / leadStats.total) * 100);
                return (
                  <li key={status}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-foreground">{STATUS_LABEL[status]}</span>
                      <span className="tabular-nums text-muted-foreground">
                        {count} <span className="text-muted-foreground/80">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-[width]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
