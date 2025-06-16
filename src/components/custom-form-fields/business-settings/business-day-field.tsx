"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"; // ShadCN Checkbox
import { cn } from "@/lib/utils";
import { CalendarDays } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Business Days Selector
const BusinessDaysField = ({
  name,
  holidayFieldName,
  icon: Icon = CalendarDays,
}: any) => {
  const { watch, setValue } = useFormContext();
  const selected = watch(name) || [];
  const holidays = watch(holidayFieldName) || [];

  const toggle = (day: string) => {
    const updated = selected.includes(day)
      ? selected.filter((d: string) => d !== day)
      : [...selected, day];
    setValue(name, updated);
  };

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {Icon && <Icon className="size-4 text-gray-500" />}
        <Label>Business Days</Label>
      </div>
      <div className="flex gap-4 flex-wrap">
        {days.map((day) => {
          const isSelected = selected.includes(day);
          const isDisabled = holidays.includes(day);

          return (
            <div key={day} className="flex items-center gap-2">
              {/* Checkbox beside the button */}
              <Checkbox
                checked={isSelected}
                disabled={isDisabled}
                onCheckedChange={() => toggle(day)}
                className="border-blue-500 hidden lg:block"
              />

              <Button
                type="button"
                onClick={() => toggle(day)}
                disabled={isDisabled}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "px-6 min-w-[72px] border-blue-500",
                  isSelected && "shadow-[inset_0px_2px_4px_0px_#001F5280]"
                )}
              >
                {day}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BusinessDaysField;
