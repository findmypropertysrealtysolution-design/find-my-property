"use client";

import { Suspense } from "react";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SITE_NAME } from "@/lib/branding";
import { useSettings } from "@/contexts/settings-context";
import { buildLoginAndRegisterHrefs } from "@/lib/auth-redirect";
import { Property } from "@/modules/properties/PropertyCard";

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
  endpoint: string;
}

function AuthGateModalLinks({ endpoint }: { endpoint: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { loginHref, registerHref } = buildLoginAndRegisterHrefs(endpoint || pathname, searchParams);

  return (
    <div className="space-y-3">
      <Button className="h-12 w-full rounded-xl text-base font-semibold" size="lg" asChild>
        <Link href={registerHref}>Sign Up</Link>
      </Button>
      <Button variant="outline" className="h-12 w-full rounded-xl text-base font-semibold" size="lg" asChild>
        <Link href={loginHref}>Log In</Link>
      </Button>
    </div>
  );
}

const AuthGateModal = ({ open, onClose, endpoint }: AuthGateModalProps) => {
  const { settings } = useSettings();
  const siteName = settings?.siteName?.trim() || SITE_NAME;
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="pointer-events-auto w-full max-w-sm"
            >
              <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
                <div className="mb-6 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl hero-gradient">
                    <Building2 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-heading text-xl font-bold text-foreground">{siteName}</span>
                </div>
                <p className="mb-6 font-heading text-lg font-semibold text-foreground">
                  Select an option to continue
                </p>
                <Suspense
                  fallback={
                    <div className="space-y-3">
                      <Button className="h-12 w-full rounded-xl text-base font-semibold" size="lg" asChild>
                        <Link href="/register">Sign Up</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-12 w-full rounded-xl text-base font-semibold"
                        size="lg"
                        asChild
                      >
                        <Link href="/login">Log In</Link>
                      </Button>
                    </div>
                  }
                >
                  <AuthGateModalLinks endpoint={endpoint} />
                </Suspense>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthGateModal;
