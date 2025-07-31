import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className = "", 
  type = "text", 
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "block w-full px-3 py-2.5 text-gray-900 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200";
  const stateStyles = error 
    ? "border-error focus:ring-error/20 focus:border-error" 
    : "border-gray-300 focus:ring-primary/20 focus:border-primary hover:border-gray-400";

  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, stateStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;