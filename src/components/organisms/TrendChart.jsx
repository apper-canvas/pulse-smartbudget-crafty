import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { getLastSixMonths } from "@/utils/dateHelpers";
import transactionService from "@/services/api/transactionService";

const TrendChart = ({ className = "" }) => {
  const [chartData, setChartData] = useState({
    income: [],
    expenses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError("");
      const transactions = await transactionService.getAll();
      const months = getLastSixMonths();
      
      const monthlyData = months.map(month => {
        const monthTransactions = transactions.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= month.start && transactionDate <= month.end;
        });
        
        const income = monthTransactions
          .filter(t => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
          
        const expenses = monthTransactions
          .filter(t => t.type === "expense")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        return {
          month: month.label,
          income,
          expenses
        };
      });
      
      setChartData({
        income: monthlyData.map(d => d.income),
        expenses: monthlyData.map(d => d.expenses)
      });
    } catch (err) {
      setError("Failed to load trend data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 card-shadow ${className}`}>
        <div className="w-28 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
        <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl p-6 card-shadow ${className}`}>
        <Error message={error} onRetry={loadChartData} />
      </div>
    );
  }

  const hasData = chartData.income.some(val => val > 0) || chartData.expenses.some(val => val > 0);

  if (!hasData) {
    return (
      <div className={`bg-white rounded-xl p-6 card-shadow ${className}`}>
        <Empty 
          title="No Data Available"
          description="Add some transactions to see your spending trends over time"
          icon="TrendingUp"
        />
      </div>
    );
  }

  const chartOptions = {
    chart: {
      type: "line",
      height: 300,
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: ["#10B981", "#EF4444"],
    xaxis: {
      categories: getLastSixMonths().map(m => m.label),
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return "$" + val.toFixed(0);
        },
        style: {
          fontSize: "12px",
          fontWeight: 500
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return "$" + val.toFixed(2);
        }
      }
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500,
      markers: {
        radius: 6
      }
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      strokeColors: ["#10B981", "#EF4444"],
      fillColors: ["#ffffff", "#ffffff"],
      hover: {
        size: 7
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        legend: {
          fontSize: "12px"
        }
      }
    }]
  };

  const series = [
    {
      name: "Income",
      data: chartData.income
    },
    {
      name: "Expenses", 
      data: chartData.expenses
    }
  ];

  return (
    <div className={`bg-white rounded-xl p-6 card-shadow hover-lift ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Spending Trends</h3>
        <div className="text-sm text-gray-500">Last 6 Months</div>
      </div>
      
      <Chart
        options={chartOptions}
        series={series}
        type="line"
        height={300}
      />
    </div>
  );
};

export default TrendChart;