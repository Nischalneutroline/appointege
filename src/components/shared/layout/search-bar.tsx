"use client";

import React from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  width?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search",
  className = "",
  onSearch,
  width,
}) => {
  const [search, setSearch] = React.useState("");
  const onSearchChange = (value: string) => {
    onSearch?.(value);
  };
  return (
    //  <div className={`relative flex max-w-sm   bg-white ${className}`}>
    //   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#A0AEC0] font-medium  " />
    //   <Input
    //     type="text"
    //     placeholder={placeholder}
    //     onChange={(e) => onSearchChange(e.target.value)}
    //     className="placeholder:pl-9 h-[40px] text-[#A0AEC0] text-sm font-medium border-0 bg-white"
    //   />
    // </div>;
    // <div className={`relative flex max-w-sm bg-white h-[40px] ${className}`}>
    //   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#A0AEC0] font-medium" />
    //   <Input
    //     type="text"
    //     placeholder={placeholder}
    //     onChange={(e) => onSearchChange(e.target.value)}
    //     className="placeholder:pl-9 h-full text-[#A0AEC0] text-sm font-medium border-0 bg-white flex-1"
    //   />
    // </div>

    <div
      className={cn(
        "relative rounded-[8px] border-[#E5E7EB] border-[1px] text-[#A0AEC0]",
        width ? width : "min-w-sm "
      )}
    >
      <Search
        strokeWidth={2.2}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
      />
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={cn(
          "pl-10 border-0 text-sm leading-5 font-normal tracking-wide",
          className
        )}
      />
    </div>
  );
};

export default SearchBar;
