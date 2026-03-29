"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Building2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { settings } = useSettings();

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "agent") return "/agent";
    if (user.role === "company") return "/company";
    return "/tenant";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 min-w-0">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-xl text-foreground">
            {settings?.siteName || "NoBroker"}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-3 min-w-0 shrink-0">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href={getDashboardLink()} className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                      {user?.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                <LogOut className="w-3.5 h-3.5 mr-1" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-3">
              <div className="flex gap-2">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={getDashboardLink()} onClick={() => setMobileOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        logout();
                        router.push("/");
                        setMobileOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href="/login" onClick={() => setMobileOpen(false)}>
                        Log In
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href="/register" onClick={() => setMobileOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
