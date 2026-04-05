"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
