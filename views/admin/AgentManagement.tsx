"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  Building2, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle,
  Clock,
  MoreVertical,
  Search,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useAgents } from "@/hooks/use-agents";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { format } from "date-fns";

const AgentManagement = () => {
  const { data: agents, isLoading, createAgent, deleteAgent, isCreating } = useAgents();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", phone: "", company: "" });

  const filteredAgents = agents?.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAgent = async () => {
    try {
      await createAgent(newAgent);
      setIsAddModalOpen(false);
      setNewAgent({ name: "", email: "", phone: "", company: "" });
    } catch (error) {
      // Toast handled in hook
    }
  };

  const getStatusBadge = (status: string, verified: boolean) => {
    if (!verified) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Pending Verify</Badge>;
    if (status === "active") return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</Badge>;
    return <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">Agent Management</h2>
          <p className="text-sm text-muted-foreground">Manage your property agents and their account status</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" /> Add New Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
              <DialogDescription>
                System will automatically send a welcome email with a 24-hour verification link.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={newAgent.name} 
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  placeholder="John Doe" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={newAgent.email} 
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  placeholder="john@example.com" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input 
                  id="phone" 
                  value={newAgent.phone} 
                  onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                  placeholder="+91 ..." 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company/Agency (Optional)</Label>
                <Input 
                  id="company" 
                  value={newAgent.company} 
                  onChange={(e) => setNewAgent({...newAgent, company: e.target.value})}
                  placeholder="Real Estate Co." 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAgent} disabled={isCreating}>
                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Stats */}
      <div className="bg-card border border-border rounded-xl p-1 shadow-sm">
        <div className="flex items-center px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <Input 
            placeholder="Search by name or email..." 
            className="border-0 focus-visible:ring-0 bg-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Agents Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 font-semibold text-foreground">Agent Info</th>
                <th className="px-6 py-4 font-semibold text-foreground">Company</th>
                <th className="px-6 py-4 font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 font-semibold text-foreground">Joined</th>
                <th className="px-6 py-4 font-semibold text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary/40" />
                    Fetching agents...
                  </td>
                </tr>
              ) : filteredAgents?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
                    No agents found matching your search.
                  </td>
                </tr>
              ) : (
                filteredAgents?.map((agent) => (
                  <tr key={agent.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{agent.name}</span>
                        <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                          <Mail className="w-3 h-3 mr-1" /> {agent.email}
                        </div>
                        {agent.phone && (
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                            <Phone className="w-3 h-3 mr-1" /> {agent.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2 opacity-50 text-primary" />
                        {agent.company || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(agent.status, agent.isVerified)}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {format(new Date(agent.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => deleteAgent(agent.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Agent
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentManagement;
