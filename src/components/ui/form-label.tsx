import React from "react";

const FormLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <label
      htmlFor="email"
      className="text-slate-700 font-semibold text-sm leading-[17px] w-fit -tracking-[0.006rem]"
    >
      {children}
    </label>
  );
};

export default FormLabel;
