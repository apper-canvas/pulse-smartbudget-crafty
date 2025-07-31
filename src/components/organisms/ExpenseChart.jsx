import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import transactionService from "@/services/api/transactionService";

const ExpenseChart = ({ className = "" }) => {
  const [chartData, setChartData] = useState([]);
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
      
      const expenses = transactions.filter(t => t.type === "expense");
      
      if (expenses.length === 0) {
        setChartData([]);
        return;
      }
      
      const categoryTotals = expenses.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {});
      
      const data = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount: Math.abs(amount)
      }));
      
      setChartData(data);
    } catch (err) {
      setError("Failed to load expense data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-6 card-shadow ${className}`}>
        <div className="w-32 h-6 bg-gray-200 rounded mb-6 animate-pulse"></div>
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

  if (chartData.length === 0) {
    return (
      <div className={`bg-white rounded-xl p-6 card-shadow ${className}`}>
        <Empty 
          title="No Expenses Yet"
          description="Start tracking your expenses to see the breakdown by category"
          icon="PieChart"
        />
      </div>
    );
  }

  const chartOptions = {
    chart: {
      type: "pie",
      height: 300,
      fontFamily: "Inter, sans-serif"
    },
    labels: chartData.map(item => item.category),
    colors: ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6", "#F97316"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500
    },
    plotOptions: {
      pie: {
        donut: {
          size: "45%"
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: "12px",
        fontWeight: 600
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return "$" + val.toFixed(2);
        }
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

  const series = chartData.map(item => item.amount);

  return (
    <div className={`bg-white rounded-xl p-6 card-shadow hover-lift ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
        <div className="text-sm text-gray-500">By Category</div>
      </div>
      
      <Chart
        options={chartOptions}
        series={series}
        type="pie"
        height={300}
      />
    </div>
  );
};

export default ExpenseChart;