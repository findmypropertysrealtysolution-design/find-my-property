import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { PropertyFormValues } from "./schema";

export const BasicInformation = () => {
  const { control } = useFormContext<PropertyFormValues>();

  return (
    <div className="space-y-4 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="propertyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Property Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Townhome">Townhome</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="listingType"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Listing Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Rent or Sale" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Rent">Rent</SelectItem>
                  <SelectItem value="Sale">For Sale</SelectItem>
                  <SelectItem value="Lease">Lease</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Property Title</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Spacious 3BHK in Whitefield" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
