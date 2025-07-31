import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

const BudgetAlertNotification = ({ 
  alert, 
  onDismiss, 
  onViewBudget,
  className = "" 
}) => {
  const isError = alert.type === 'error';
  const isWarning = alert.type === 'warning';

  return (
    <div className={cn(
      "p-4 rounded-lg border-l-4 bg-white shadow-sm",
      isError && "border-l-error bg-red-50",
      isWarning && "border-l-warning bg-yellow-50",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <ApperIcon
            name={isError ? "AlertTriangle" : "AlertCircle"}
            size={20}
            className={cn(
              isError ? "text-error" : "text-warning"
            )}
          />
          <div className="flex-1">
            <p className={cn(
              "text-sm font-medium",
              isError ? "text-red-800" : "text-yellow-800"
            )}>
              {alert.message}
            </p>
            <p className={cn(
              "text-xs mt-1",
              isError ? "text-red-600" : "text-yellow-600"
            )}>
              {alert.percentage.toFixed(1)}% of budget used
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {onViewBudget && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewBudget(alert.budgetId)}
            >
              View
            </Button>
          )}
          <button
            onClick={() => onDismiss(alert.Id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetAlertNotification;