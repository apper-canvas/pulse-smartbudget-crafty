import React from "react";
import ApperIcon from "@/components/ApperIcon";
import BudgetAlertNotification from "@/components/atoms/BudgetAlertNotification";
import { formatCurrency, formatPercentage } from "@/utils/currency";
import { cn } from "@/utils/cn";
const BudgetCard = ({ budget, onEdit, alert, onDismissAlert, className = "" }) => {
  const spentPercentage = (budget.spent / budget.monthlyLimit) * 100;
  const remaining = budget.monthlyLimit - budget.spent;
  const isOverBudget = spentPercentage > 100;
  
  const progressColor = isOverBudget 
    ? "bg-gradient-to-r from-error to-red-600" 
    : spentPercentage > 80 
    ? "bg-gradient-to-r from-warning to-yellow-500"
    : "bg-gradient-to-r from-success to-accent";

  return (
    <div className={cn("bg-white rounded-xl p-6 card-shadow hover-lift group", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{budget.category}</h3>
          <p className="text-sm text-gray-500">{budget.period}</p>
        </div>
        
        <button
          onClick={() => onEdit(budget)}
          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <ApperIcon name="Settings" className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Spent</span>
          <span className="font-medium">{formatCurrency(budget.spent)} of {formatCurrency(budget.monthlyLimit)}</span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={cn("h-2.5 rounded-full transition-all duration-300", progressColor)}
              style={{ width: `${Math.min(spentPercentage, 100)}%` }}
            ></div>
          </div>
          {isOverBudget && (
            <div className="absolute -top-1 -right-1">
              <ApperIcon name="AlertTriangle" className="w-4 h-4 text-error" />
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
<span className={cn(
            "text-sm font-medium",
            isOverBudget ? "text-error" : remaining < budget.monthlyLimit * 0.2 ? "text-warning" : "text-success"
          )}>
            {isOverBudget ? "Over budget" : `${formatCurrency(remaining)} remaining`}
          </span>
          <span className="text-sm text-gray-500">
            {formatPercentage(spentPercentage)}
          </span>
        </div>

        {alert && (
          <BudgetAlertNotification
            alert={alert}
            onDismiss={onDismissAlert}
            className="mt-3"
          />
        )}
      </div>
    </div>
  );
};

export default BudgetCard;