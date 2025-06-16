import { BellRing, ChevronDown } from "lucide-react";
import React from "react";

const UserHeaderInfo = () => {
  return (
    <div className="flex gap-8 items-center">
      <div className="flex relative items-center">
        <div className="flex items-center">
          <BellRing
            size={22}
            style={{
              color: "#6B7280",
            }}
          />
        </div>
        <div className="flex items-center justify-center absolute -top-4 -right-4 w-4.5 h-4.5 bg-red-500 rounded-full text-white text-[12px] font-semibold ">
          1
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex items-center text-xl font-semibold w-10 h-10 bg-[#8B5CF6] text-white rounded-full justify-center">
          PS
        </div>
        <ChevronDown className="text-[#6B7280]" />
      </div>
    </div>
  );
};

export default UserHeaderInfo;
