import { Card } from "@/components/ui/card";
import React from "react";

interface LayoutCardsProps {
  option: {
    value: string;
    label: string;
    count: number;
    icon: React.ReactNode;
    background: string;
    border: string;
  };
}
const LayoutCards = ({ option }: LayoutCardsProps) => {
  return (
    <Card
      key={option.value}
      className={`flex-1 gap-1 p-3 rounded-[12px] hover:scale-105 transition duration-400 cursor-pointer shadow-[-1px_2px_2px_rgba(0,0,0,0.15)]`}
      style={{
        backgroundColor: option.background,
        border: `1px solid ${option.border}`,
      }}
    >
      <div className={`font-normal text-sm text-secondary leading-[150%] `}>
        {option.label}
      </div>
      <div className="flex justify-between items-end">
        <div className="font-medium text-lg text-black h-full flex items-center">
          {option.count}
        </div>
        <div className="flex items-center justify-center w-[35px] h-[35px] bg-[#FFFFFF] rounded-[8px]">
          {option.icon}
        </div>
      </div>
    </Card>
  );
};

export default LayoutCards;
