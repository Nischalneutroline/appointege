"use client";

import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Smile } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Holiday Selector with checkbox
const HolidayField = ({ name, disableFieldName, icon: Icon = Smile }: any) => {
  const { watch, setValue } = useFormContext();

  const selected = watch(name) || [];
  const businessDays = watch(disableFieldName) || [];

  const toggle = (day: string) => {
    const updated = selected.includes(day)
      ? selected.filter((d: string) => d !== day)
      : [...selected, day];

    setValue(name, updated);

    // Remove from business days if added to holiday
    setValue(
      disableFieldName,
      businessDays.filter((d: string) => !updated.includes(d))
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        {Icon && <Icon className="size-4 text-gray-500" />}
        <Label>Holiday</Label>
      </div>

      <div className="flex flex-wrap gap-4">
        {days.map((day) => {
          const isChecked = selected.includes(day);

          return (
            <div className="flex items-center gap-2" key={day}>
              {/* Checkbox to reflect selection */}
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => toggle(day)}
                // on check border whould be red
                className="border-destructive/30 hidden lg:block data-[state=checked]:bg-destructive data-[state=checked]:border-destructive/30"
              />

              {/* Button to toggle day */}
              <Button
                type="button"
                onClick={() => toggle(day)}
                variant={isChecked ? "destructive" : "outline"}
                className="min-w-[72px] px-6 border-destructive/30"
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

export default HolidayField;
