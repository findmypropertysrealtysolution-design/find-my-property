"use client";

import { Users } from "lucide-react";

export default function Agents() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Agents</h1>
        <p className="text-muted-foreground max-w-sm">
          Browse and contact agents. This page can be expanded with agent listings and profiles.
        </p>
      </div>
    </div>
  );
}
