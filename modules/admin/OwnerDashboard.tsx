"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { Building2, CheckCircle, Upload, IndianRupee, MapPin } from "lucide-react";

const steps = [
  { icon: Building2, title: "Add Property Details", desc: "Type, location, amenities" },
  { icon: Upload, title: "Upload Photos", desc: "Add clear photos of your property" },
  { icon: IndianRupee, title: "Set Your Price", desc: "Choose rent or sale price" },
  { icon: CheckCircle, title: "Get Tenants", desc: "Start receiving enquiries" },
];

const OwnerDashboard = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <div className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* How it works */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              List Your Property for <span className="text-primary">Free</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto px-1 text-sm sm:text-base">
              Reach tenants and buyers directly with maximum visibility for your listing.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-2"
              >
                <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center mx-auto">
                  <step.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-sm text-foreground">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Listing Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-card rounded-2xl p-6 md:p-8 card-shadow border border-border"
          >
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Property Details</h2>
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Property Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="independent">Independent House</SelectItem>
                      <SelectItem value="pg">PG / Hostel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Listing Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Rent or Sale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">For Rent</SelectItem>
                      <SelectItem value="sale">For Sale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Property Title</label>
                <Input placeholder="e.g. Spacious 3BHK in Whitefield" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="City, Area" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Price (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Monthly rent or price" className="pl-10" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Bedrooms</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="BHK" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} BHK</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Bathrooms</label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Bath" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Area (sq.ft)</label>
                  <Input placeholder="1200" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea placeholder="Describe your property, amenities, nearby landmarks..." rows={4} />
              </div>

              <Button size="lg" className="w-full">
                <Upload className="w-4 h-4 mr-2" /> List Property
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;
