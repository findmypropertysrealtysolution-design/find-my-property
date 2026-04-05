"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ExternalLink,
  Loader2,
  Pencil,
  Search,
} from "lucide-react";
import { useAdminProperties } from "@/hooks/use-properties";
import { useAgents } from "@/hooks/use-agents";
import type { BackendProperty } from "@/lib/property-mapper";
import { buildPropertyPath } from "@/lib/property-slug";
import { PropertyStatus } from "@/lib/property-mapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
type SortKey =
  | "id"
  | "title"
  | "city"
  | "listingType"
  | "propertyType"
  | "price"
  | "bedrooms"
  | "bathrooms"
  | "area"
  | "status";

function formatPrice(p: BackendProperty) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: p.currency || "INR",
    maximumFractionDigits: 0,
  }).format(Number(p.price) || 0);
}

function areaSqFt(p: BackendProperty) {
  const m = Number(p.area ?? 0) || 0;
  return Math.round(m * 10.7639);
}

function statusBadge(status?: string) {
  const s = status ?? "";
  if (s === PropertyStatus.APPROVED)
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
        Approved
      </Badge>
    );
  if (s === PropertyStatus.REJECTED)
    return (
      <Badge variant="outline" className="bg-red-50 text-red-800 border-red-200">
        Rejected
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
      Pending
    </Badge>
  );
}

function compareRows(a: BackendProperty, b: BackendProperty, key: SortKey, dir: "asc" | "desc") {
  const mul = dir === "asc" ? 1 : -1;
  switch (key) {
    case "id":
      return (a.id - b.id) * mul;
    case "price":
      return ((Number(a.price) || 0) - (Number(b.price) || 0)) * mul;
    case "bedrooms":
      return ((Number(a.bedrooms) || 0) - (Number(b.bedrooms) || 0)) * mul;
    case "bathrooms":
      return ((Number(a.bathrooms) || 0) - (Number(b.bathrooms) || 0)) * mul;
    case "area":
      return (areaSqFt(a) - areaSqFt(b)) * mul;
    default: {
      const av = String(
        key === "title"
          ? a.title
          : key === "city"
            ? a.city
            : key === "listingType"
              ? a.listingType
              : key === "propertyType"
                ? a.propertyType
                : key === "status"
                  ? a.status ?? ""
                  : "",
      );
      const bv = String(
        key === "title"
          ? b.title
          : key === "city"
            ? b.city
            : key === "listingType"
              ? b.listingType
              : key === "propertyType"
                ? b.propertyType
                : key === "status"
                  ? b.status ?? ""
                  : "",
      );
      return av.localeCompare(bv, undefined, { sensitivity: "base" }) * mul;
    }
  }
}

const AdminPropertiesList = () => {
  const { data: rows = [], isLoading, isError, error } = useAdminProperties();
  const { data: agents = [] } = useAgents();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "id",
    dir: "desc",
  });

  const agentNameById = useMemo(() => {
    const m = new Map<number, string>();
    for (const a of agents) {
      const label = (a.name ?? a.email ?? "").trim() || `Agent #${a.id}`;
      m.set(a.id, label);
    }
    return m;
  }, [agents]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((p) => {
      const agentLabel =
        p.assignedAgentId != null ? agentNameById.get(p.assignedAgentId) ?? String(p.assignedAgentId) : "";
      const hay = [
        String(p.id),
        p.title,
        p.city,
        p.address,
        p.locality ?? "",
        String(p.listingType ?? ""),
        String(p.propertyType ?? ""),
        String(p.status ?? ""),
        agentLabel,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, search, agentNameById]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => compareRows(a, b, sort.key, sort.dir));
    return copy;
  }, [filtered, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" },
    );
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sort.key !== column) return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-40" />;
    return sort.dir === "asc" ? (
      <ArrowUp className="ml-1 h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="ml-1 h-3.5 w-3.5" />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">All properties</h2>
          <p className="text-sm text-muted-foreground">
            Search, sort, and open any listing. {rows.length > 0 && `${rows.length} total.`}
          </p>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, title, city, address, type, status…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {isError && (
        <p className="text-sm text-destructive">
          {(error as Error)?.message ?? "Could not load properties."}
        </p>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading properties…
        </div>
      ) : sorted.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {search.trim() ? "No properties match your search." : "No properties yet."}
        </p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-md border bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[72px]">
                  <button
                    type="button"
                    className="inline-flex items-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("id")}
                  >
                    ID
                    <SortIcon column="id" />
                  </button>
                </TableHead>
                <TableHead className="min-w-[160px]">
                  <button
                    type="button"
                    className="inline-flex items-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("title")}
                  >
                    Title
                    <SortIcon column="title" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("city")}
                  >
                    City
                    <SortIcon column="city" />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell max-w-[200px]">Address</TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("listingType")}
                  >
                    Listing
                    <SortIcon column="listingType" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    type="button"
                    className="inline-flex items-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("propertyType")}
                  >
                    Type
                    <SortIcon column="propertyType" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("price")}
                  >
                    Price
                    <SortIcon column="price" />
                  </button>
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("bedrooms")}
                  >
                    Beds
                    <SortIcon column="bedrooms" />
                  </button>
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("bathrooms")}
                  >
                    Baths
                    <SortIcon column="bathrooms" />
                  </button>
                </TableHead>
                <TableHead className="hidden xl:table-cell text-right">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-end font-medium hover:text-foreground"
                    onClick={() => toggleSort("area")}
                  >
                    Area (sq.ft)
                    <SortIcon column="area" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    type="button"
                    className="inline-flex items-center font-medium hover:text-foreground"
                    onClick={() => toggleSort("status")}
                  >
                    Status
                    <SortIcon column="status" />
                  </button>
                </TableHead>
                <TableHead className="hidden lg:table-cell text-right">Agent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.id}</TableCell>
                  <TableCell className="font-medium max-w-[220px] truncate" title={p.title}>
                    {p.title || "—"}
                  </TableCell>
                  <TableCell>{p.city || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[200px] truncate text-muted-foreground text-xs">
                    {[p.address, p.locality].filter(Boolean).join(", ") || "—"}
                  </TableCell>
                  <TableCell className="text-xs">{String(p.listingType ?? "—")}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs">
                    {String(p.propertyType ?? "—")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatPrice(p)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {Number(p.bedrooms) || "—"}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {Number(p.bathrooms) || "—"}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell text-right text-muted-foreground text-xs">
                    {areaSqFt(p).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>{statusBadge(p.status)}</TableCell>
                  <TableCell
                    className="hidden lg:table-cell max-w-[160px] text-right text-sm text-foreground"
                    title={
                      p.assignedAgentId != null
                        ? `${agentNameById.get(p.assignedAgentId) ?? "Agent"} (id ${p.assignedAgentId})`
                        : undefined
                    }
                  >
                    {p.assignedAgentId != null ? (
                      <span className="line-clamp-2 break-words">
                        {agentNameById.get(p.assignedAgentId) ?? `Agent #${p.assignedAgentId}`}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={buildPropertyPath(p.id, p.title)} title="View public page">
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/edit-property/${p.id}`} title="Edit as admin">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
};

export default AdminPropertiesList;
