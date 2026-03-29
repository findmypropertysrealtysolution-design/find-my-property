"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Eye, Clock, MapPin, Bed, Bath, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useProperties } from "@/hooks/use-properties"
import { api } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { PropertyStatus } from "@/lib/property-mapper"
import type { Property } from "@/components/PropertyCard"

const PropertyApproval = () => {
  const { data: properties, refetch } = useProperties()
  const { toast } = useToast()
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  )
  const [rejectReason, setRejectReason] = useState("")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectTarget, setRejectTarget] = useState<string | null>(null)

  const updateStatus = async (id: string, status: PropertyStatus) => {
    try {
      await api.updateProperty(id, { status })
      toast({ title: "Status updated successfully!" })
      refetch()
    } catch (err) {
      const errorMessage = (err as Error)?.message || "An error occurred"
      toast({
        title: "Failed to update property",
        description: errorMessage || "An error occurred",
        variant: "destructive",
      })
    }
  }

  const handleApprove = (id: string) => {
    updateStatus(id, PropertyStatus.APPROVED)
  }

  const handleReject = (id: string) => {
    setRejectTarget(id)
    setShowRejectDialog(true)
  }

  const confirmReject = () => {
    if (rejectTarget) {
      updateStatus(rejectTarget, PropertyStatus.REJECTED)
      setRejectReason("")
      setShowRejectDialog(false)
      setRejectTarget(null)
    }
  }

  const getFiltered = (statusTab: string) => {
    let mappedStatus = PropertyStatus.PENDING
    if (statusTab === "approved") mappedStatus = PropertyStatus.APPROVED
    if (statusTab === "rejected") mappedStatus = PropertyStatus.REJECTED
    return (properties || []).filter(
      (p) => (p.status || PropertyStatus.PENDING) === mappedStatus
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-1 font-heading text-xl font-bold text-foreground">
          Property Approvals
        </h2>
        <p className="text-sm text-muted-foreground">
          Review and approve property listings submitted by agents
        </p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            Pending ({getFiltered("pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-1.5">
            <Check className="h-3.5 w-3.5" />
            Approved ({getFiltered("approved").length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Rejected ({getFiltered("rejected").length})
          </TabsTrigger>
        </TabsList>

        {(["pending", "approved", "rejected"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {getFiltered(tab).length === 0 ? (
              <div className="py-16 text-center text-muted-foreground">
                <Clock className="mx-auto mb-3 h-10 w-10 opacity-50" />
                <p>No {tab} properties</p>
              </div>
            ) : (
              <div className="space-y-3">
                {getFiltered(tab).map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-28 w-full shrink-0 rounded-lg object-cover sm:w-40"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3 className="truncate font-heading font-semibold text-foreground">
                          {property.title}
                        </h3>
                        <Badge
                          variant={
                            property.type === "rent" ? "default" : "secondary"
                          }
                          className="shrink-0"
                        >
                          {property.type === "rent" ? "Rent" : "Sale"}
                        </Badge>
                      </div>
                      <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {property.location}
                      </div>
                      <div className="mb-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" />
                          {property.bedrooms} Bed
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" />
                          {property.bathrooms} Bath
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize className="h-3.5 w-3.5" />
                          {property.area}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-foreground">
                            {property.price}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            by {property.ownerName || "Agent"}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            · Recent
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedProperty(property)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {tab === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => handleApprove(property.id)}
                              >
                                <Check className="mr-1 h-4 w-4" /> Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-destructive/30 text-destructive hover:bg-destructive/10"
                                onClick={() => handleReject(property.id)}
                              >
                                <X className="mr-1 h-4 w-4" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Detail Dialog */}
      <Dialog
        open={!!selectedProperty}
        onOpenChange={() => setSelectedProperty(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          {selectedProperty && (
            <div className="space-y-4">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="h-48 w-full rounded-lg object-cover"
              />
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg bg-muted p-3">
                  <Bed className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {selectedProperty.bedrooms} Bed
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <Bath className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">
                    {selectedProperty.bathrooms} Bath
                  </p>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <Maximize className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{selectedProperty.area}</p>
                </div>
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-foreground">
                  Status
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedProperty.status || "Pending"}
                </p>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Owner: {selectedProperty.ownerName || "Unknown"}
                </span>
                <span className="font-semibold text-foreground">
                  {selectedProperty.price}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Reason for rejection (optional)..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReject}>
                Confirm Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PropertyApproval
