"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Smartphone, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth, type User } from "@/contexts/AuthContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useToast } from "@/hooks/use-toast";
import { getPostAuthRoute } from "@/lib/auth-redirect";

const normalizePhone = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("+")) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  return trimmed;
};

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const { loginWithPhone, requestPhoneOtp } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  const { toast } = useToast();

  const handleSendOtp = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return;
    }

    const formattedPhone = normalizePhone(phone);
    if (!formattedPhone) {
      toast({
        title: "Phone number required",
        description: "Enter a valid phone number with country code.",
        variant: "destructive",
      });
      return;
    }

    setSendingOtp(true);
    const result = await requestPhoneOtp(formattedPhone);
    setSendingOtp(false);

    if (!result.success) {
      toast({
        title: "Unable to send OTP",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setPhone(formattedPhone);
    setOtpSent(true);
    toast({ title: "OTP sent", description: `Verification code sent to ${formattedPhone}` });
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      toast({ title: "OTP not sent", description: "Request OTP first.", variant: "destructive" });
      return;
    }

    setVerifyingOtp(true);
    const result = await loginWithPhone(phone, otp, name);
    setVerifyingOtp(false);

    if (!result.success) {
      toast({ title: "Signup failed", description: result.error, variant: "destructive" });
      return;
    }

    const nextUser = JSON.parse(localStorage.getItem("nb_user") || "null") as User | null;
    const from = new URLSearchParams(window.location.search).get("from");
    const safeFrom =
      from && from.startsWith("/") && from !== "/login" && from !== "/register"
        ? from
        : null;
    router.replace(safeFrom || getPostAuthRoute(nextUser));
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="absolute inset-0 bg-linear-to-br from-primary/40 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-12 left-8 right-8 max-w-md"
        >
          <div className="bg-card/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <p className="text-foreground text-sm leading-relaxed mb-4">
              &quot;{settings?.siteName || "NoBroker"} helped us find our dream home in Bangalore. All we just did was
              search their listings and we found it in a few minutes!&quot;
            </p>
            <div>
              <p className="font-heading font-semibold text-foreground text-sm">Priya Sharma</p>
              <p className="text-muted-foreground text-xs">Software Engineer, Bangalore</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-y-auto overflow-x-hidden bg-muted/10">
        <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[400px] bg-background/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-primary to-primary-foreground/90 flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
              <Building2 className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground text-sm">
              Sign up securely with your phone number to get started.
            </p>
          </div>

          <form onSubmit={handlePhoneSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                  <Input
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 w-full pl-11 rounded-xl bg-background border-input shadow-sm focus-visible:ring-1 focus-visible:ring-primary transition-all text-base"
                    disabled={otpSent || sendingOtp}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-foreground ml-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/70" />
                  <Input
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-12 w-full pl-11 rounded-xl bg-background border-input shadow-sm focus-visible:ring-1 focus-visible:ring-primary transition-all text-base"
                    disabled={otpSent || sendingOtp}
                    required
                  />
                </div>
              </div>

              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  className="space-y-2 overflow-hidden"
                >
                  <label className="text-sm font-medium leading-none text-foreground ml-1">
                    One-Time Password
                  </label>
                  <Input
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="h-12 w-full rounded-xl bg-background border-input shadow-sm focus-visible:ring-1 focus-visible:ring-primary text-center tracking-[0.5em] text-lg font-medium transition-all"
                    maxLength={10}
                    required
                  />
                </motion.div>
              )}
            </div>

            {!otpSent ? (
              <Button
                type="button"
                className="w-full h-12 rounded-xl text-base font-semibold shadow-md active:scale-[0.98] transition-all"
                onClick={handleSendOtp}
                disabled={sendingOtp || !phone.trim() || !name.trim()}
              >
                {sendingOtp ? "Sending OTP..." : "Continue with Phone"}
              </Button>
            ) : (
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl text-base font-semibold shadow-md active:scale-[0.98] transition-all"
                  disabled={verifyingOtp || otp.length < 4}
                >
                  {verifyingOtp ? "Verifying..." : "Verify & Sign Up"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-10 rounded-xl text-sm text-muted-foreground hover:bg-muted/50"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending..." : "Didn't receive code? Resend"}
                </Button>
              </div>
            )}
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary font-semibold hover:underline transition-all">
              Log in instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
