"use client";

import { motion } from "framer-motion";
import { Bell, MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const alerts = [
  { id: "1", label: "2BHK in HSR Layout", type: "rent", priceRange: "₹15K - ₹25K", matches: 5 },
  { id: "2", label: "3BHK in Whitefield", type: "rent", priceRange: "₹25K - ₹40K", matches: 3 },
  { id: "3", label: "Villa in Koramangala", type: "buy", priceRange: "₹80L - ₹1.5Cr", matches: 1 },
];

const TenantAlerts = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-heading text-xl font-bold text-foreground mb-1">My Alerts</h2>
        <p className="text-sm text-muted-foreground">Get notified when matching properties are listed</p>
      </div>
      <Button size="sm"><Bell className="w-4 h-4 mr-1" /> New Alert</Button>
    </div>

    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground text-sm">{alert.label}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[10px]">{alert.type}</Badge>
              <span className="text-xs text-muted-foreground">{alert.priceRange}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-primary">{alert.matches} matches</p>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </motion.div>
      ))}
    </div>
  </div>
);

export default TenantAlerts;
