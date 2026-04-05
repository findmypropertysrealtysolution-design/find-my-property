"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserCircle, Mail, Phone, Shield } from "lucide-react";
import type { UserRole } from "@/contexts/auth-context";

const Profile = () => {
  const { user, profile, updateUser, updateProfileLocal, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(profile.phone ?? "");
  }, [user?.name, profile.phone]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: name.trim() || user?.name });
    updateProfileLocal({ phone: phone.trim() || undefined });
    toast({
      title: "Profile updated",
      description: "Your changes have been saved.",
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">My Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your account details</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                {user.name.split(" ").map((n) => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-foreground truncate">{user.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <span className="inline-block mt-1 text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">
                {user.role}
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="tenant-name" className="flex items-center gap-2 text-foreground">
                <UserCircle className="w-4 h-4" /> Full Name
              </Label>
              <Input
                id="tenant-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-email" className="flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="tenant-email"
                value={user.email ?? ""}
                disabled
                className="bg-muted/50 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
            </div>

            {user.defaultRole === "admin" && (
              <div className="space-y-2 p-4 bg-primary/5 rounded-xl border border-primary/20">
                <Label className="flex items-center gap-2 text-primary font-semibold">
                  <Shield className="w-4 h-4" /> Super Admin Role Override
                </Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={user.role}
                  onChange={async (e) => {
                    const val = e.target.value as UserRole;
                    const res = await updateProfile({ role: val });
                    if (res.success) {
                      toast({ title: "Role updated", description: `You are now a ${val}. Re-routing...` });
                      window.location.href = `/${val}/dashboard`;
                    } else {
                      toast({ title: "Failed", description: res.error || "Unknown error", variant: "destructive" });
                    }
                  }}
                >
                  <option value="tenant">Tenant</option>
                  <option value="agent">Agent</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-muted-foreground">Instantly switches your role context on the backend and updates your session.</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="tenant-phone" className="flex items-center gap-2 text-foreground">
                <Phone className="w-4 h-4" /> Phone
              </Label>
              <Input
                id="tenant-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-background"
              />
            </div>
          </div>
        </div>
        <Button type="submit" className="w-full sm:w-auto">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default Profile;
