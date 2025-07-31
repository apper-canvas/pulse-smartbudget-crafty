import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/dateHelpers";
import { cn } from "@/utils/cn";

const TransactionItem = ({ transaction, onEdit, onDelete, className = "" }) => {
  const isIncome = transaction.type === "income";
  
  return (
    <div className={cn("flex items-center justify-between py-4 px-1 hover:bg-gray-50 rounded-lg transition-colors duration-200 group", className)}>
      <div className="flex items-center space-x-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          isIncome 
            ? "bg-gradient-to-br from-success/10 to-accent/10" 
            : "bg-gradient-to-br from-error/10 to-red-100"
        )}>
          <ApperIcon 
            name={isIncome ? "ArrowDownRight" : "ArrowUpRight"} 
            className={cn("w-5 h-5", isIncome ? "text-success" : "text-error")}
          />
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <span>{transaction.category}</span>
            <span>•</span>
            <span>{formatDate(transaction.date)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className={cn(
            "font-semibold",
            isIncome ? "text-success" : "text-error"
          )}>
            {isIncome ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(transaction)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(transaction.Id)}
            className="p-2 text-gray-400 hover:text-error hover:bg-error/10 rounded-lg transition-colors duration-200"
          >
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;