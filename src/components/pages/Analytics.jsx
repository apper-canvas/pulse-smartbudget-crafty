import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { toast } from "react-toastify";
import transactionService from "@/services/api/transactionService";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import { formatCurrency, formatPercentage } from "@/utils/currency";
import { getLastSixMonths } from "@/utils/dateHelpers";

const Analytics = () => {
  const [data, setData] = useState({
    transactions: [],
    monthlyData: [],
    categoryData: [],
    stats: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("6months");

  const handleExportReport = () => {
    try {
      if (!data || data.transactions.length === 0) {
        toast.error("No data available to export");
        return;
      }

      // Generate CSV content
      const csvContent = generateFinancialReportCSV(data);
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `financial-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report exported successfully!");
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export report. Please try again.");
    }
  };

  const generateFinancialReportCSV = (data) => {
    const { transactions, stats } = data;
    
    let csv = "Financial Analytics Report\n";
    csv += `Generated on: ${new Date().toLocaleDateString()}\n\n`;
    
    // Summary Section
    csv += "FINANCIAL SUMMARY\n";
    csv += "Category,Amount\n";
    csv += `Total Income,${formatCurrency(stats.totalIncome)}\n`;
    csv += `Total Expenses,${formatCurrency(stats.totalExpenses)}\n`;
    csv += `Net Income,${formatCurrency(stats.netWorth)}\n`;
    csv += `Average Monthly Income,${formatCurrency(stats.avgMonthlyIncome)}\n`;
    csv += `Average Monthly Expenses,${formatCurrency(stats.avgMonthlyExpenses)}\n`;
    csv += `Savings Rate,${formatPercentage(stats.savingsRate)}\n\n`;
    
    return csv;
  };

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const transactions = await transactionService.getAll();
      
      const months = getLastSixMonths();
      
      // Monthly trend data
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
          expenses,
          net: income - expenses
        };
      });
      
      // Category breakdown
      const expenses = transactions.filter(t => t.type === "expense");
      const categoryTotals = expenses.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
        return acc;
      }, {});
      
      const categoryData = Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount);
      
      // Overall stats
      const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
        
      const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
      const avgMonthlyIncome = totalIncome / months.length;
      const avgMonthlyExpenses = totalExpenses / months.length;
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
      
      setData({
        transactions,
        monthlyData,
        categoryData,
        stats: {
          totalIncome,
          totalExpenses,
          netWorth: totalIncome - totalExpenses,
          avgMonthlyIncome,
          avgMonthlyExpenses,
          savingsRate
        }
      });
    } catch (err) {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;

  if (data.transactions.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Financial Analytics</h2>
          <p className="text-gray-600 mt-1">Detailed insights into your spending patterns</p>
        </div>
        
        <Empty
          title="No Data for Analytics"
          description="Start adding transactions to see detailed analytics and spending insights."
          icon="BarChart3"
        />
      </div>
    );
  }

  // Monthly trend chart options
  const monthlyChartOptions = {
    chart: {
      type: "line",
      height: 350,
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false }
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    colors: ["#10B981", "#EF4444", "#2563EB"],
    xaxis: {
      categories: data.monthlyData.map(d => d.month),
      labels: {
        style: { fontSize: "12px", fontWeight: 500 }
      }
    },
    yaxis: {
      labels: {
        formatter: function(val) {
          return "$" + val.toFixed(0);
        },
        style: { fontSize: "12px", fontWeight: 500 }
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      }
    },
    legend: {
      fontSize: "14px",
      fontWeight: 500
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3
    }
  };

  const monthlySeries = [
    {
      name: "Income",
      data: data.monthlyData.map(d => d.income)
    },
    {
      name: "Expenses", 
      data: data.monthlyData.map(d => d.expenses)
    },
    {
      name: "Net",
      data: data.monthlyData.map(d => d.net)
    }
  ];

  // Category breakdown chart
  const categoryChartOptions = {
    chart: {
      type: "donut",
      height: 350,
      fontFamily: "Inter, sans-serif"
    },
    labels: data.categoryData.slice(0, 8).map(item => item.category),
    colors: ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6", "#F97316"],
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 500
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%"
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function(val) {
        return val.toFixed(1) + "%";
      }
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return formatCurrency(val);
        }
      }
    }
  };

  const categorySeries = data.categoryData.slice(0, 8).map(item => item.amount);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Financial Analytics</h2>
          <p className="text-gray-600 mt-1">Detailed insights into your spending patterns</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="6months">Last 6 Months</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          
<Button 
            variant="outline" 
            size="sm" 
            leftIcon="Download"
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={data.stats.totalIncome}
          icon="TrendingUp"
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={data.stats.totalExpenses}
          icon="TrendingDown"
          trend="down"
        />
        <StatCard
          title="Avg Monthly Income"
          value={data.stats.avgMonthlyIncome}
          icon="Calendar"
          trend="neutral"
        />
        <StatCard
          title="Savings Rate"
          value={`${formatPercentage(data.stats.savingsRate)}`}
          icon="PiggyBank"
          trend={data.stats.savingsRate > 20 ? "up" : data.stats.savingsRate > 10 ? "neutral" : "down"}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 card-shadow hover-lift">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <div className="text-sm text-gray-500">Income vs Expenses</div>
          </div>
          
          <Chart
            options={monthlyChartOptions}
            series={monthlySeries}
            type="line"
            height={350}
          />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 card-shadow hover-lift">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Expense Categories</h3>
            <div className="text-sm text-gray-500">Top 8 Categories</div>
          </div>
          
          <Chart
            options={categoryChartOptions}
            series={categorySeries}
            type="donut"
            height={350}
          />
        </div>
      </div>

      {/* Detailed Category Breakdown */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
        
        <div className="space-y-4">
          {data.categoryData.map((category, index) => {
            const percentage = (category.amount / data.stats.totalExpenses) * 100;
            return (
              <div key={category.category} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 rounded-full" style={{
                    backgroundColor: ["#2563EB", "#7C3AED", "#10B981", "#F59E0B", "#EF4444", "#06B6D4", "#8B5CF6", "#F97316"][index % 8]
                  }}></div>
                  <span className="font-medium text-gray-900">{category.category}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{formatCurrency(category.amount)}</div>
                    <div className="text-sm text-gray-500">{formatPercentage(percentage)}</div>
                  </div>
                  
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;