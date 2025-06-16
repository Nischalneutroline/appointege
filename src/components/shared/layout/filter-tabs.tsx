import { FilterOption } from "@/app/admin/appointment/_data/data";
import { Appointment } from "@/data/appointment";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface FilterTabsProps {
  option: FilterOption;
  activeFilter: string;
  setSelectedData: (data: Appointment[]) => void;
  setActiveFilter: (filter: string) => void;
}

const FilterTabs = ({
  option,
  activeFilter,
  setSelectedData,
  setActiveFilter,
}: FilterTabsProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const isActive = activeFilter === option.label;
  const backgroundColor = isActive
    ? option.background
    : isHovered
    ? option.background
    : undefined;

  const border = isActive ? `1px solid ${option.border}` : "none";

  return (
    <div
      key={option.value}
      className={cn(
        `w-22 text-sm font-normal px-2 py-2 flex justify-center items-center 
         transition-transform duration-300 cursor-pointer rounded-[8px] 
         ${!isActive && "hover:scale-105"}`
      )}
      style={{
        backgroundColor,
        border,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setSelectedData(option.data);
        setActiveFilter(option.label);
      }}
    >
      {option.label === "All Appointments" ? "All" : option.label}
    </div>
  );
};

export default FilterTabs;
