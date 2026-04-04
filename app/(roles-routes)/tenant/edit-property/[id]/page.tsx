"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import type { BackendProperty } from "@/lib/property-mapper";
import AddProperty from "@/modules/tenant/AddProperty";
import { Loader2 } from "lucide-react";

export default function EditPropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState<BackendProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    api.getRawProperty(String(params.id))
      .then((data) => {
        setProperty(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-destructive bg-destructive/10 rounded-lg">
        Failed to load property details. {error}
      </div>
    );
  }

  return <AddProperty initialData={property || undefined} />;
}
