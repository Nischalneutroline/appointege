import React from "react";
import Breadcrumbs from "./bread-crumb";
import Heading from "../admin/shared/heading";
import { CalendarDays } from "lucide-react";

const PageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* <Breadcrumbs /> */}
      {children}
    </>
  );
};

export default PageHeader;
