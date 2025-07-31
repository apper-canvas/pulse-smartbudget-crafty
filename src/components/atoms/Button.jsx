import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = forwardRef(({ 
  children, 
  className = "", 
  variant = "primary", 
  size = "md", 
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:scale-105 focus:ring-primary/20",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md focus:ring-primary/20",
    outline: "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white hover:shadow-md focus:ring-primary/20",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200",
    success: "bg-gradient-to-r from-success to-accent text-white hover:shadow-lg hover:scale-105 focus:ring-success/20",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:scale-105 focus:ring-error/20"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {loading && <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && leftIcon && <ApperIcon name={leftIcon} className="w-4 h-4 mr-2" />}
      {children}
      {!loading && rightIcon && <ApperIcon name={rightIcon} className="w-4 h-4 ml-2" />}
    </button>
  );
});

Button.displayName = "Button";

export default Button;