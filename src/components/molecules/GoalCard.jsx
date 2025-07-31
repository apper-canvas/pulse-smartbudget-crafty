import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatPercentage } from "@/utils/currency";
import { formatDate } from "@/utils/dateHelpers";
import { cn } from "@/utils/cn";

const GoalCard = ({ goal, onEdit, className = "" }) => {
  const progressPercentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.currentAmount;
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  
  return (
    <div className={cn("bg-white rounded-xl p-6 card-shadow hover-lift group", className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{goal.name}</h3>
          <p className="text-sm text-gray-500">Target: {formatDate(goal.deadline)}</p>
        </div>
        
        <button
          onClick={() => onEdit(goal)}
          className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        >
          <ApperIcon name="Settings" className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-3">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${(progressPercentage / 100) * 251.2} 251.2`}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">
                {formatPercentage(progressPercentage)}
              </span>
            </div>
          </div>
          
          {isCompleted ? (
            <div className="flex items-center justify-center space-x-2 text-success">
              <ApperIcon name="CheckCircle" className="w-5 h-5" />
              <span className="font-medium">Goal Completed!</span>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              {formatCurrency(remaining)} to go
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">
            {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;