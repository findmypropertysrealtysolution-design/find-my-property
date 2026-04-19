"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_NAME } from "@/lib/branding";
import { useSettings } from "@/contexts/settings-context";

function VerifyAgentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { settings } = useSettings();
  const siteName = settings?.siteName?.trim() || SITE_NAME;

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.verifyAgent(token);
        setStatus("success");
        setMessage(res.message || "Account successfully activated!");
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Verification failed. The link may be expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-card rounded-3xl shadow-2xl p-8 text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl hero-gradient flex items-center justify-center">
            <Building2 className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Agent Verification</h1>
          <p className="text-muted-foreground text-sm">{siteName} - Professional Network</p>
        </div>

        <div className="py-8 flex flex-col items-center gap-4">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-foreground animate-pulse">Verifying your credentials...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <p className="text-foreground font-medium">{message}</p>
              <Button className="w-full mt-4" onClick={() => router.push("/login")}>
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <p className="text-foreground font-medium">{message}</p>
              <Button variant="outline" className="w-full mt-4" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
          Secure JWT Verification System
        </p>
      </motion.div>
    </div>
  );
}

export default function VerifyAgentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyAgentContent />
    </Suspense>
  );
}
