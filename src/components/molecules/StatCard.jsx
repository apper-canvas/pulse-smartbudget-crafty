import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatPercentage } from "@/utils/currency";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  trend = "neutral",
  className = "",
  loading = false 
}) => {
  const trendColors = {
    up: "text-success",
    down: "text-error", 
    neutral: "text-gray-500"
  };

  const trendIcons = {
    up: "TrendingUp",
    down: "TrendingDown",
    neutral: "Minus"
  };

  if (loading) {
    return (
      <div className={cn("bg-white rounded-xl p-6 card-shadow", className)}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-xl p-6 card-shadow hover-lift group", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-200">
          <ApperIcon name={icon} className="w-5 h-5 text-primary" />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">
          {typeof value === "number" ? formatCurrency(value) : value}
        </p>
        
        {change !== undefined && (
          <div className="flex items-center space-x-1">
            <ApperIcon 
              name={trendIcons[trend]} 
              className={cn("w-4 h-4", trendColors[trend])} 
            />
            <span className={cn("text-sm font-medium", trendColors[trend])}>
              {typeof change === "number" ? formatPercentage(Math.abs(change)) : change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;