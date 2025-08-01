import React, { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import { AuthContext } from "../../App";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { logout } = useContext(AuthContext);
  const { user } = useSelector((state) => state.user);

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/": return "Dashboard";
      case "/transactions": return "Transactions";
      case "/budgets": return "Budgets";
      case "/goals": return "Goals";  
      case "/analytics": return "Analytics";
      default: return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuToggle={() => setSidebarOpen(true)}
          title={getPageTitle()}
        />
        
        {/* User info and logout */}
        <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
              <span className="text-sm text-gray-600">
                Welcome, {user.firstName || user.name || 'User'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                leftIcon="LogOut"
              >
                Logout
              </Button>
            </div>
          )}
        </div>
        
        {/* Global notification area */}
        <div className="notification-container fixed top-20 right-4 z-50 space-y-2 max-w-sm">
          {/* Budget alerts would be rendered here */}
        </div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;