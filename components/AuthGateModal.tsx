"use client";

import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSettings } from "@/contexts/SettingsContext";
import { motion, AnimatePresence } from "framer-motion";

interface AuthGateModalProps {
  open: boolean;
  onClose: () => void;
  pendingPropertyId?: string | null;
}

const AuthGateModal = ({ open, onClose }: AuthGateModalProps) => {
  const { settings } = useSettings();
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm pointer-events-auto"
            >
              <div className="bg-card rounded-2xl p-8 shadow-2xl border border-border">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-heading font-bold text-xl text-foreground">
                  {settings?.siteName || "NoBroker"}
                </span>
              </div>
              <p className="text-foreground font-heading font-semibold text-lg mb-6">
                Select an option to continue
              </p>
              <div className="space-y-3">
                <Button className="w-full h-12 rounded-xl text-base font-semibold" size="lg" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
                <Button variant="outline" className="w-full h-12 rounded-xl text-base font-semibold" size="lg" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
              </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthGateModal;
