import React from "react";

const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-fade-in ${className}`}>
      {/* Dashboard Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="w-32 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="w-28 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
          <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Recent Transactions Skeleton */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="w-40 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;