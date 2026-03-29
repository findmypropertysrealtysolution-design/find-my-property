"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, MapPin, Shield } from "lucide-react";
import type { UserRole } from "@/contexts/AuthContext";

const CompanyProfile = () => {
  const { user, profile, updateUser, updateProfileLocal, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [companyName, setCompanyName] = useState(profile.companyName ?? "");
  const [address, setAddress] = useState(profile.address ?? "");

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(profile.phone ?? "");
    setCompanyName(profile.companyName ?? "");
    setAddress(profile.address ?? "");
  }, [user?.name, profile.phone, profile.companyName, profile.address]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: name.trim() || user?.name });
    updateProfileLocal({
      phone: phone.trim() || undefined,
      companyName: companyName.trim() || undefined,
      address: address.trim() || undefined,
    });
    toast({
      title: "Company profile updated",
      description: "Your changes have been saved.",
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">Company Profile</h2>
        <p className="text-sm text-muted-foreground">Edit company details and contact information</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-card rounded-2xl border border-border p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <Avatar className="h-16 w-16 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                <Building2 className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-foreground truncate">
                {profile.companyName || user.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{user.email}</p>
              <span className="inline-block mt-1 text-xs text-muted-foreground capitalize bg-muted px-2 py-0.5 rounded">
                Company
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="company-name" className="flex items-center gap-2 text-foreground">
                <Building2 className="w-4 h-4" /> Company Name
              </Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your company name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-contact" className="flex items-center gap-2 text-foreground">
                Contact Name
              </Label>
              <Input
                id="company-contact"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Primary contact name"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-email" className="flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4" /> Email
              </Label>
              <Input
                id="company-email"
                value={user.email ?? ""}
                disabled
                className="bg-muted/50 text-muted-foreground cursor-not-allowed"
              />
            </div>

            {user.email === "sahinppmdon7@gmail.com" && (
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
                  <option value="company">Company</option>
                  <option value="admin">Admin</option>
                </select>
                <p className="text-xs text-muted-foreground">Instantly switches your role context on the backend and updates your session.</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="company-phone" className="flex items-center gap-2 text-foreground">
                <Phone className="w-4 h-4" /> Phone
              </Label>
              <Input
                id="company-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company-address" className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4" /> Address
              </Label>
              <Textarea
                id="company-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Registered office or business address"
                rows={3}
                className="bg-background resize-none"
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

export default CompanyProfile;
