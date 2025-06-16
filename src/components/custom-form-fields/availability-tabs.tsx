"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

import { LucideIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
const AvailabilityTabs = ({
  name,
  icon: Icon,
}: {
  name: string;
  icon?: LucideIcon;
}) => {
  const { watch, setValue } = useFormContext();
  const value = watch(name);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-4 text-gray-500" />}
        <Label>Avaiablity</Label>
      </div>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v: any) => v && setValue(name, v)}
        className="gap-2"
      >
        <ToggleGroupItem
          value="default"
          className="data-[state=on]:bg-[#E98651]  data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-4"
          style={{
            boxShadow:
              value === "default" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Default
        </ToggleGroupItem>
        <ToggleGroupItem
          value="custom"
          className="data-[state=on]:bg-[#E98651] data-[state=on]:inset-shadow-sm data-[state=on]:border-none data-[state=on]:text-white rounded-lg border px-4"
          style={{
            boxShadow:
              value === "custom" ? "0px 2px 4px 0px #001F5280 inset" : "",
          }}
        >
          Custom
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default AvailabilityTabs;
