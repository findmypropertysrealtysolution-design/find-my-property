"use client";

import { motion } from "framer-motion";
import { Mail, Phone, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const leads = [
  { id: "l1", name: "Arun Verma", email: "arun@gmail.com", phone: "+91 98765 43210", property: "3BHK in Whitefield", status: "new", time: "10 min ago" },
  { id: "l2", name: "Meera Das", email: "meera@gmail.com", phone: "+91 87654 32109", property: "2BHK in HSR Layout", status: "contacted", time: "2 hrs ago" },
  { id: "l3", name: "Karthik R", email: "karthik@gmail.com", phone: "+91 76543 21098", property: "4BHK Villa in Koramangala", status: "new", time: "5 hrs ago" },
  { id: "l4", name: "Divya S", email: "divya@gmail.com", phone: "+91 65432 10987", property: "1BHK in Indiranagar", status: "closed", time: "1 day ago" },
];

const AgentLeads = () => (
  <div className="space-y-6">
    <div>
      <h2 className="font-heading text-xl font-bold text-foreground mb-1">Leads</h2>
      <p className="text-sm text-muted-foreground">Enquiries from interested tenants</p>
    </div>

    <div className="space-y-3">
      {leads.map((lead, i) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {lead.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground text-sm">{lead.name}</h3>
              <Badge variant={lead.status === "new" ? "default" : lead.status === "contacted" ? "secondary" : "outline"} className="text-[10px]">
                {lead.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">{lead.property}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
              <span className="flex items-center gap-1 hidden sm:flex"><Phone className="w-3 h-3" />{lead.phone}</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> {lead.time}
          </span>
        </motion.div>
      ))}
    </div>
  </div>
);

export default AgentLeads;
