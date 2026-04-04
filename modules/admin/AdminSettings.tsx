"use client";

import { motion } from "framer-motion";
import { 
  Settings as SettingsIcon, 
  Globe, 
  Palette, 
  Lock, 
  ShieldCheck, 
  Bell, 
  Database,
  Cloud,
  Mail,
  UserCog,
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAdminSettings } from "@/hooks/use-admin-settings";
import { useState, useEffect } from "react";
import type { Settings } from "@/lib/api";

const AdminSettings = () => {
  const { data: settings, isLoading, updateSettings, isUpdating } = useAdminSettings();
  const [localSettings, setLocalSettings] = useState<Partial<Settings>>({});

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = (key: keyof Settings, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    await updateSettings(localSettings);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading system configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">System Settings</h2>
          <p className="text-sm text-muted-foreground">Manage global application configuration and features</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" disabled={isUpdating} onClick={() => setLocalSettings(settings || {})}>
            Discard Changes
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="general" className="gap-2 rounded-lg">
            <Globe className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2 rounded-lg">
            <Palette className="w-4 h-4" /> Branding
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 rounded-lg">
            <Bell className="w-4 h-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2 rounded-lg">
            <Cloud className="w-4 h-4" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2 rounded-lg">
            <Lock className="w-4 h-4" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="grid gap-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 text-primary" /> Application Details
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="listing-type">Listing Type</Label>
                  <Select
                    value={localSettings.siteName || ""}
                    onValueChange={(value) => handleChange("siteName", value)}
                  >
                    <SelectTrigger id="listing-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="short-term">Short Term</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={localSettings.supportEmail || ""}
                    onValueChange={(value) => handleChange("supportEmail", value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" /> Global Constraints
              </h3>
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Auto-approve Listings</p>
                  <p className="text-xs text-muted-foreground">Automatically approve properties submitted by trusted agents</p>
                </div>
                <Switch 
                  checked={localSettings.autoApproveListings || false}
                  onCheckedChange={(checked) => handleChange("autoApproveListings", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">New Agent Registration</p>
                  <p className="text-xs text-muted-foreground">Allow new agents to register without manual review</p>
                </div>
                <Switch 
                  checked={localSettings.newAgentRegistration || false}
                  onCheckedChange={(checked) => handleChange("newAgentRegistration", checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-6">
             <div className="space-y-4">
               <h3 className="font-heading font-semibold text-foreground">Theme & Colors</h3>
               <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { id: "modern-blue", label: "Modern Blue", color: "bg-primary" },
                    { id: "nature-green", label: "Nature Green", color: "bg-emerald-600" },
                    { id: "deep-indigo", label: "Deep Indigo", color: "bg-indigo-600" },
                  ].map((t) => (
                    <div 
                      key={t.id}
                      onClick={() => handleChange("theme", t.id)}
                      className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                        localSettings.theme === t.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className={`w-full h-8 ${t.color} rounded`} />
                      <span className="text-xs font-medium">{t.label}</span>
                    </div>
                  ))}
               </div>
             </div>
             <Separator />
             <div className="grid sm:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <Label>Primary Logo URL</Label>
                 <Input 
                   value={localSettings.primaryLogoUrl || ""} 
                   onChange={(e) => handleChange("primaryLogoUrl", e.target.value)}
                   placeholder="https://..."
                 />
               </div>
               <div className="space-y-2">
                 <Label>Favicon URL</Label>
                 <Input 
                   value={localSettings.faviconUrl || ""} 
                   onChange={(e) => handleChange("faviconUrl", e.target.value)}
                   placeholder="https://..."
                 />
               </div>
             </div>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> API & Keys
            </h3>
            <div className="space-y-4">
               <div className="space-y-2">
                 <Label>Cloudinary API Key</Label>
                 <Input 
                   type="password" 
                   value={localSettings.cloudinaryApiKey || ""} 
                   onChange={(e) => handleChange("cloudinaryApiKey", e.target.value)}
                   placeholder="Encrypted Key"
                 />
               </div>
               <div className="space-y-2">
                 <Label>Google Maps Key</Label>
                 <Input 
                   type="password" 
                   value={localSettings.googleMapsKey || ""} 
                   onChange={(e) => handleChange("googleMapsKey", e.target.value)}
                   placeholder="Encrypted Key"
                 />
               </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
              <UserCog className="w-4 h-4 text-primary" /> Admin Permissions
            </h3>
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Enforce 2FA for all administrative accounts</p>
              </div>
              <Switch 
                checked={localSettings.twoFactorAuthEnforced || false}
                onCheckedChange={(checked) => handleChange("twoFactorAuthEnforced", checked)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
