"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Building2, Users, UserCircle, LayoutDashboard, FileText } from "lucide-react";

const sections = [
  {
    title: "Main",
    links: [
      { href: "/", label: "Home" },
      { href: "/properties", label: "Browse Properties" },
      { href: "/agents", label: "Agents" },
      { href: "/owner", label: "For Owners" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log In" },
      { href: "/register", label: "Sign Up" },
    ],
  },
  {
    title: "Tenant",
    links: [
      { href: "/tenant", label: "Tenant Dashboard" },
      { href: "/tenant/listings", label: "My Listings" },
      { href: "/tenant/favorites", label: "Favorites" },
      { href: "/tenant/alerts", label: "Alerts" },
      { href: "/tenant/profile", label: "Profile" },
    ],
  },
  {
    title: "Agent",
    links: [
      { href: "/agent", label: "Agent Dashboard" },
      { href: "/agent/listings", label: "My Listings" },
      { href: "/agent/leads", label: "Leads" },
      { href: "/agent/reports", label: "Reports" },
      { href: "/agent/profile", label: "Profile" },
    ],
  },
  {
    title: "Admin",
    links: [
      { href: "/admin", label: "Admin Dashboard" },
      { href: "/admin/approvals", label: "Property Approval" },
      { href: "/admin/agents", label: "Agent Management" },
      { href: "/admin/analytics", label: "Analytics" },
    ],
  },
];

const iconBySection: Record<string, React.ElementType> = {
  Main: Building2,
  Account: UserCircle,
  Tenant: LayoutDashboard,
  Agent: Users,
  Company: Building2,
  Admin: FileText,
};

const Sitemap = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground">Sitemap</h1>
            </div>
            <p className="text-muted-foreground mb-10">
              All main pages and sections of the site. Property detail pages are available from the property listing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sections.map((section) => {
                const Icon = iconBySection[section.title] ?? FileText;
                return (
                  <div
                    key={section.title}
                    className="bg-card border border-border rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                      <h2 className="font-heading font-semibold text-foreground text-lg">
                        {section.title}
                      </h2>
                    </div>
                    <ul className="space-y-2">
                      {section.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors break-words"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> Individual property pages (e.g. /property/1) are
                linked from the{" "}
                <Link href="/properties" className="text-primary hover:underline">
                  Browse Properties
                </Link>{" "}
                page. For search engines, see{" "}
                <a href="/sitemap.xml" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  sitemap.xml
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sitemap;
