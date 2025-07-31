import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false, 
  className = "",
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      
      {type === "select" ? (
        <Select error={!!error} {...props}>
          {children}
        </Select>
      ) : (
        <Input type={type} error={!!error} {...props} />
      )}
      
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;