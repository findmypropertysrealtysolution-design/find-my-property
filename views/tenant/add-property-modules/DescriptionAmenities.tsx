import { useFormContext } from "react-hook-form";
import { Plus } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { PropertyFormValues } from "./schema";

const AMENITIES_OPTIONS = [
  { id: "garden", label: "Garden" },
  { id: "solar_panels", label: "Solar Panels" },
  { id: "tennis_court", label: "Tennis Court" },
  { id: "swimming_pool", label: "Swimming Pool" },
  { id: "fireplace", label: "Fireplace" },
  { id: "outdoor_kitchen", label: "Outdoor Kitchen" },
  { id: "parking", label: "Parking" },
  { id: "gym", label: "Gym" },
  { id: "security", label: "24/7 Security" },
  { id: "lift", label: "Lift" },
  { id: "power_backup", label: "Power Backup" },
];

export const DescriptionAmenities = () => {
  const { control } = useFormContext<PropertyFormValues>();

  return (
    <>
      <section className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="font-heading font-semibold text-foreground">Description</h3>
        <p className="text-sm text-muted-foreground">
          Describe your property, amenities, connectivity, nearby schools, hospitals, and shopping.
        </p>
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="Text your description here." rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className="text-xs text-muted-foreground">
          Tags like Rent, House, and your locality will be added from the details above.
        </p>
      </section>

      <section className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-heading font-semibold text-foreground">Amenities & Features</h3>
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">Suggested</span>
        </div>
        <p className="text-sm text-muted-foreground">Select all that apply from the options below</p>
        <FormField
          control={control}
          name="amenities"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES_OPTIONS.map((a) => (
                  <FormField
                    key={a.id}
                    control={control}
                    name="amenities"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(a.label);
                      return (
                        <FormItem
                          key={a.id}
                          className={cn(
                            "flex flex-row items-center gap-2 rounded-lg border border-border p-3 cursor-pointer transition-colors space-y-0 hover:bg-muted/50",
                            isChecked && "border-primary bg-primary/5"
                          )}
                        >
                          <FormControl>
                            <Checkbox
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, a.label])
                                  : field.onChange(field.value?.filter((value) => value !== a.label));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="flex items-center gap-1.5 text-sm font-normal cursor-pointer w-full !mt-0">
                            <Plus className="w-3.5 h-3.5 text-primary" /> {a.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>
    </>
  );
};
