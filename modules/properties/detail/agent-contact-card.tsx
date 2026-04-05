"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Headphones, Loader2, Phone, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Property } from "@/components/property/PropertyCard";
import { SITE_NAME } from "@/lib/branding";

type LeadPayload = { propertyId: string; message?: string };

type AgentContactCardProps = {
  property: Pick<Property, "id" | "title"> & { agentName?: string };
  canEnquireAsTenant: boolean;
  isAuthReady: boolean;
  userRole: string | undefined;
  loginHref: string;
  enquiryOpen: boolean;
  onEnquiryOpenChange: (open: boolean) => void;
  enquiryMessage: string;
  onEnquiryMessageChange: (value: string) => void;
  createLead: {
    mutateAsync: (payload: LeadPayload) => Promise<unknown>;
    isPending: boolean;
  };
};

/** Listing agent: enquiry flow (lead) for tenants; sign-in CTA for guests. */
export function AgentContactCard({
  property,
  canEnquireAsTenant,
  isAuthReady,
  userRole,
  loginHref,
  enquiryOpen,
  onEnquiryOpenChange,
  enquiryMessage,
  onEnquiryMessageChange,
  createLead,
}: AgentContactCardProps) {
  const agentLabel = property.agentName?.trim() || "Listing agent";

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10">
            <Headphones className="h-6 w-6 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="wrap-break-word font-heading text-sm font-semibold text-foreground">{agentLabel}</p>
            <p className="wrap-break-word text-xs text-muted-foreground">
              Assigned listing agent · {SITE_NAME}
            </p>
          </div>
        </div>

        <p className="mb-4 text-xs text-muted-foreground">
          Ref #{property.id} · {property.title}
        </p>

        <div className="flex flex-col gap-2 border-t border-border pt-4">
          {canEnquireAsTenant ? (
            <>
              <Button className="w-full gap-2" size="lg" type="button" onClick={() => onEnquiryOpenChange(true)}>
                <Send className="h-4 w-4" /> Send enquiry to agent
              </Button>
              <Dialog open={enquiryOpen} onOpenChange={onEnquiryOpenChange}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Enquiry about this listing</DialogTitle>
                    <DialogDescription>
                      Your profile details will be shared with the listing agent. Add an optional message below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-2 py-2">
                    <Label htmlFor="enquiry-msg-agent">Message (optional)</Label>
                    <Textarea
                      id="enquiry-msg-agent"
                      placeholder="e.g. I’d like to schedule a visit this weekend…"
                      value={enquiryMessage}
                      onChange={(e) => onEnquiryMessageChange(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => onEnquiryOpenChange(false)}>
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      disabled={createLead.isPending}
                      onClick={async () => {
                        try {
                          await createLead.mutateAsync({
                            propertyId: property.id,
                            message: enquiryMessage.trim() || undefined,
                          });
                          onEnquiryOpenChange(false);
                          onEnquiryMessageChange("");
                        } catch {
                          /* toast in hook */
                        }
                      }}
                    >
                      {createLead.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Send enquiry
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : isAuthReady && userRole === "agent" ? (
            <p className="py-2 text-center text-xs text-muted-foreground">
              Tenants can send enquiries from this listing. Open this page while logged in as a tenant to test.
            </p>
          ) : (
            <Button className="w-full gap-2" size="lg" asChild>
              <Link href={loginHref}>
                <Phone className="h-4 w-4" /> Sign in to send enquiry
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
