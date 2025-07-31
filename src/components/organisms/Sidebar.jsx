import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose, className = "" }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Transactions", path: "/transactions", icon: "Receipt" },
    { name: "Budgets", path: "/budgets", icon: "PieChart" },
    { name: "Goals", path: "/goals", icon: "Target" },
    { name: "Analytics", path: "/analytics", icon: "BarChart3" }
  ];

  const MenuContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-3 p-6 border-b border-gray-200">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
          <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-text">SmartBudget</h1>
          <p className="text-sm text-gray-500">Personal Finance</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <ApperIcon 
                    name={item.icon} 
                    className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                    )} 
                  />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-gray-900">Pro Tip</span>
          </div>
          <p className="text-xs text-gray-600">
            Set up automatic budget alerts to stay on track with your financial goals.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:block w-80 bg-white border-r border-gray-200 h-screen", className)}>
        <MenuContent />
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
          <div className="relative w-80 bg-white h-full transform transition-transform duration-300 ease-in-out translate-x-0">
            <MenuContent />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;