import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import ExpenseChart from "@/components/organisms/ExpenseChart";
import TrendChart from "@/components/organisms/TrendChart";
import TransactionItem from "@/components/molecules/TransactionItem";
import TransactionForm from "@/components/organisms/TransactionForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { formatCurrency, calculatePercentageChange } from "@/utils/currency";
import { getCurrentMonth, getMonthRange, getPreviousMonth } from "@/utils/dateHelpers";
import transactionService from "@/services/api/transactionService";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await transactionService.getAll();
      setTransactions(data);
    } catch (err) {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        await transactionService.delete(id);
        toast.success("Transaction deleted successfully!");
        loadTransactions();
      } catch (error) {
        toast.error("Failed to delete transaction");
      }
    }
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleFormSuccess = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
    loadTransactions();
  };

  const handleFormCancel = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTransactions} />;

  // Calculate current month statistics
  const currentMonth = getMonthRange();
  const previousMonth = getMonthRange(getPreviousMonth());
  
  const currentMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= currentMonth.start && transactionDate <= currentMonth.end;
  });
  
  const previousMonthTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= previousMonth.start && transactionDate <= previousMonth.end;
  });

  const currentIncome = currentMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const currentExpenses = currentMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const currentBalance = currentIncome - currentExpenses;

  const previousIncome = previousMonthTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const previousExpenses = previousMonthTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const previousBalance = previousIncome - previousExpenses;

  const incomeChange = calculatePercentageChange(currentIncome, previousIncome);
  const expenseChange = calculatePercentageChange(currentExpenses, previousExpenses);
  const balanceChange = calculatePercentageChange(currentBalance, previousBalance);

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (showTransactionForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <TransactionForm
          transaction={editingTransaction}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Financial Overview</h2>
          <p className="text-gray-600 mt-1">{getCurrentMonth()}</p>
        </div>
        <Button
          variant="primary"
          leftIcon="Plus"
          onClick={() => setShowTransactionForm(true)}
          className="hidden sm:flex"
        >
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Income"
          value={currentIncome}
          change={incomeChange}
          icon="TrendingUp"
          trend={incomeChange >= 0 ? "up" : "down"}
        />
        <StatCard
          title="Total Expenses"
          value={currentExpenses}
          change={expenseChange}
          icon="TrendingDown"
          trend={expenseChange <= 0 ? "up" : "down"}
        />
        <StatCard
          title="Net Balance"
          value={currentBalance}
          change={balanceChange}
          icon="DollarSign"
          trend={balanceChange >= 0 ? "up" : "down"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpenseChart />
        <TrendChart />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Button 
            variant="outline" 
            size="sm"
            rightIcon="ArrowRight"
          >
            View All
          </Button>
        </div>

        {recentTransactions.length === 0 ? (
          <Empty
            title="No Transactions Yet"
            description="Start by adding your first income or expense transaction"
            action={() => setShowTransactionForm(true)}
            actionLabel="Add Transaction"
            icon="Receipt"
          />
        ) : (
          <div className="space-y-2">
            {recentTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.Id}
                transaction={transaction}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Add Button */}
      <button
        onClick={() => setShowTransactionForm(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center justify-center z-40"
      >
        <ApperIcon name="Plus" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Dashboard;