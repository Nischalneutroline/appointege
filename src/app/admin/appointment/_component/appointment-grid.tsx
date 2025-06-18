import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pill } from "@/components/ui/pill";
import { Appointment } from "@/data/appointment";
import { getInitials } from "@/lib/utils";

import {
  Calendar,
  Clock,
  Ellipsis,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  PhoneCall,
  SquarePen,
  Trash2,
} from "lucide-react";
import React from "react";

const AppointmentGrid = ({ item }: { item: Appointment }) => {
  const statusVariants = {
    "Follow Up": "warning",
    Completed: "success",
    Missed: "destructive",
    Canceled: "default",
    Scheduled: "secondary",
  } as const;

  const variant =
    statusVariants[item.status as keyof typeof statusVariants] || "default";

  return (
    <div className="flex flex-col gap-2 rounded-[12px] border-[1px] border-[#E5E7EB] bg-white p-5">
      <div className="flex justify-between ">
        <div
          className="flex items-center justify-center h-9.5 w-10  text-white font-semibold rounded-[8px]"
          style={{ backgroundColor: item.color }}
        >
          {getInitials(item.name)}
        </div>
        <div className="flex items-start gap-2">
          <Pill variant={variant} withDot>
            {item.status}
          </Pill>
          <div className="flex items-start h-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <Ellipsis size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="">
                <DropdownMenuItem
                  className="group/view text-gray-500 hover:bg-gray-50"
                  onClick={() => console.log("Clicked Edit", item)}
                >
                  <Eye className="mr-1 h-3.5 w-3.4 group-hover/view:text-[#2563EB] text-[#2563EB]" />
                  <div className="group-hover/view:text-[#2563EB]">View</div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Clicked Edit", item)}
                  className="group/edit text-gray-500 hover:bg-gray-50"
                >
                  <SquarePen className="mr-2 h-4 w-4 group-hover/edit:text-[#10B981] text-[#10B981]" />
                  <div className="group-hover/edit:text-[#10B981]">Edit</div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => console.log("Clicked Delete", item)}
                  className="group/delete text-gray-500 hover:bg-gray-50"
                >
                  <Trash2 className="mr-2 h-4 w-4 group-hover/delete:text-red-500 text-red-500" />
                  <div className="group-hover/delete:text-red-500">Delete</div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="text-[#111827] text-lg font-semibold">{item.name}</div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-4 text-center ">
            <div className="flex text-sm font-normal text-[#78818C]">
              Dental Cleaning
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} strokeWidth={2.5} color="#92AAF3" />
              <div className="font-medium text-sm text-[#78818C]">Physical</div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <PhoneCall size={14} strokeWidth={2.5} color="#92AAF3" />
              <div className="text-sm font-normal text-[#78818C]">
                9867373778
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} strokeWidth={2.5} color="#92AAF3" />
              <div className="text-sm font-normal text-[#78818C]">
                samrat.neutoline@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <Calendar size={14} strokeWidth={2.5} color="#92AAF3" />
          <div className="text-sm font-normal text-[#78818C]">2025-05-23</div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} strokeWidth={2.5} color="#92AAF3" />
          <div className="text-sm font-normal text-[#78818C]">
            10:00 AM (30 min)
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentGrid;
