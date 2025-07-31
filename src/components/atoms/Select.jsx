import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({ 
  children, 
  className = "", 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "block w-full px-3 py-2.5 text-gray-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 cursor-pointer";
  const stateStyles = error 
    ? "border-error focus:ring-error/20 focus:border-error" 
    : "border-gray-300 focus:ring-primary/20 focus:border-primary hover:border-gray-400";

  return (
    <select
      ref={ref}
      className={cn(baseStyles, stateStyles, className)}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;