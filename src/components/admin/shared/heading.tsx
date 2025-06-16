import React from "react";

interface HeadingProps {
  title: string;
  description: string;
}

const Heading = ({ title, description }: HeadingProps) => {
  return (
    <div className="  text-[#2563EB]  ">
      <div className="flex items-center gap-2 ">
        <span className="text-3xl text-start font-semibold ">{title}</span>
      </div>
      <p className="text-base  font-normal text-start text-[#5C6B84]">
        {description}
      </p>
    </div>
  );
};

export default Heading;
