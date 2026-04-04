import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LocationPicker, { type LocationValue, type AddressComponents } from "@/components/property/LocationPicker";
import type { PropertyFormValues } from "./schema";

export const LocationSection = () => {
  const { control, setValue } = useFormContext<PropertyFormValues>();
  const [mapLocation, setMapLocation] = useState<LocationValue | null>(null);

  const handleAddressFromMap = useCallback((addr: AddressComponents | null) => {
    if (!addr) return;
    if (addr.address != null) setValue("address", addr.address, { shouldValidate: true });
    if (addr.locality != null) setValue("locality", addr.locality, { shouldValidate: true });
    if (addr.city != null) setValue("city", addr.city, { shouldValidate: true });
    if (addr.state != null) setValue("state", addr.state, { shouldValidate: true });
    if (addr.country != null) setValue("country", addr.country, { shouldValidate: true });
  }, [setValue]);

  return (
    <div className="space-y-4 pb-2">
      <div className="space-y-4">
        <FormField
          control={control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address / Street</FormLabel>
              <FormControl>
                <Input placeholder="Building name, street, landmark" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="locality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locality / Area</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Whitefield" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Bengaluru" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Karnataka" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormLabel>Pin your property on map</FormLabel>
          <LocationPicker
            value={mapLocation}
            onChange={setMapLocation}
            onAddressChange={handleAddressFromMap}
            height={320}
            showLinkInput
            showSearchInput
          />
          {mapLocation && (
            <p className="text-xs text-muted-foreground mt-2">
              Location set. We’ll use this pin and your address fields for search; otherwise we’ll use locality.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
