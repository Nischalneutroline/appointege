import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { UserCheck } from "lucide-react";

const ToggleSwitch = ({ name, label, icon }: any) => {
  const { watch, setValue, register } = useFormContext();
  const value = watch(name);

  // Register the field
  register(name, { value: Boolean(value) });

  return (
    <div className="flex items-center gap-4 w-full">
      <div className="flex items-center gap-2">
        {icon ?? <UserCheck className="size-4 text-gray-500" />}
        <Label>{label}</Label>
      </div>
      <Switch
        checked={Boolean(value)}
        onCheckedChange={(val) => {
          setValue(name, Boolean(val), { shouldDirty: true });
        }}
      />
    </div>
  );
};

export default ToggleSwitch;
