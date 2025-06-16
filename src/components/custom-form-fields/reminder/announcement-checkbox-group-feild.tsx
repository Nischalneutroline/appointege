"use client";

import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { LucideIcon } from "lucide-react";

interface CheckboxGroupFieldProps {
  name: string;
  label: string;
  options: string[];
  className?: string;
  icon?: LucideIcon;
}

const AnnouncementCheckboxGroupField = ({
  name,
  label,
  options,
  className,
  icon: Icon,
}: CheckboxGroupFieldProps) => {
  const { control, setValue, watch } = useFormContext();

  const toggleCheckbox = (value: string) => {
    const current = watch(name);
    if (current.includes(value)) {
      setValue(name, []); // uncheck if clicked again
    } else {
      setValue(name, [value]); // only this one selected
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className={className}>
          <div className="flex gap-1">
            {Icon && <Icon className="size-4 text-gray-500" />}
            <FormLabel>{label}</FormLabel>
          </div>
          <div className="flex flex-col md:flex-row flex-wrap gap-4">
            {options.map((option) => (
              <div key={option} className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    id={option}
                    checked={watch(name).includes(option)}
                    onCheckedChange={() => toggleCheckbox(option)}
                  />
                </FormControl>
                <Label htmlFor={option}>{option}</Label>
              </div>
            ))}
          </div>
        </FormItem>
      )}
    />
  );
};

export default AnnouncementCheckboxGroupField;
