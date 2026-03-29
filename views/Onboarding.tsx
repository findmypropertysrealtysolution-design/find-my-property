"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getPostAuthRoute } from "@/lib/auth-redirect";

const Onboarding = () => {
  const { user, isAuthenticated, isAuthReady, updateProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.onboardingCompleted) {
      router.replace(getPostAuthRoute(user));
      return;
    }

    setEmail(user?.email || "");
    setName(user?.name || "");
    setLocationAddress(user?.locationAddress || "");
    setLocationCity(user?.locationCity || "");
    setLocationState(user?.locationState || "");
    setLocationCountry(user?.locationCountry || "");
    setLatitude(user?.latitude ?? undefined);
    setLongitude(user?.longitude ?? undefined);
  }, [isAuthReady, isAuthenticated, router, user]);

  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location unavailable",
        description: "Geolocation is not supported on this device. Please enter location manually.",
        variant: "destructive",
      });
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
          );
          const data = (await response.json()) as {
            display_name?: string;
            address?: {
              city?: string;
              town?: string;
              village?: string;
              state?: string;
              country?: string;
              county?: string;
            };
          };
          setLocationAddress(data.display_name || "");
          setLocationCity(
            data.address?.city ||
              data.address?.town ||
              data.address?.village ||
              data.address?.county ||
              "",
          );
          setLocationState(data.address?.state || "");
          setLocationCountry(data.address?.country || "");
          toast({ title: "Location detected", description: "You can edit the fields if needed." });
        } catch {
          toast({
            title: "Location fetched partially",
            description: "Coordinates captured. Enter city/state/country manually if needed.",
          });
        } finally {
          setDetectingLocation(false);
        }
      },
      () => {
        setDetectingLocation(false);
        toast({
          title: "Location permission denied",
          description: "Please enter your location manually.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" });
      return;
    }
    if (!name.trim() || !locationCity.trim() || !locationCountry.trim()) {
      toast({
        title: "Missing fields",
        description: "Name, city and country are required.",
        variant: "destructive",
      });
      return;
    }

    setSavingProfile(true);
    const result = await updateProfile({
      email: email.trim(),
      name: name.trim(),
      locationAddress: locationAddress.trim(),
      locationCity: locationCity.trim(),
      locationState: locationState.trim(),
      locationCountry: locationCountry.trim(),
      latitude,
      longitude,
    });
    setSavingProfile(false);

    if (!result.success) {
      toast({ title: "Profile update failed", description: result.error, variant: "destructive" });
      return;
    }

    const latestUser = JSON.parse(localStorage.getItem("nb_user") || "null");
    router.replace(getPostAuthRoute(latestUser));
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">Complete Your Profile</h1>
            <p className="text-sm text-muted-foreground">Add email, name, and confirm location.</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Location auto-detect is optional. You can edit manually.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                </div>

                <div className="flex gap-3 flex-wrap items-center">
                  <Button type="button" variant="outline" onClick={handleDetectLocation} disabled={detectingLocation}>
                    <LocateFixed className="w-4 h-4 mr-2" />
                    {detectingLocation ? "Detecting..." : "Use Current Location"}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    If permission is denied, enter location fields manually below.
                  </span>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="Street / area / locality"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={locationCity} onChange={(e) => setLocationCity(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input value={locationState} onChange={(e) => setLocationState(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={locationCountry} onChange={(e) => setLocationCountry(e.target.value)} />
                  </div>
                </div>

                <Button type="submit" className="w-full sm:w-auto" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Finish Setup"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Onboarding;
