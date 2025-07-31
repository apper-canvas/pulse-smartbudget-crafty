import React, { useState, useEffect } from "react";
import TransactionItem from "@/components/molecules/TransactionItem";
import TransactionForm from "@/components/organisms/TransactionForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import transactionService from "@/services/api/transactionService";
import categoryService from "@/services/api/categoryService";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    search: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [transactionData, categoryData] = await Promise.all([
        transactionService.getAll(),
        categoryService.getAll()
      ]);
      setTransactions(transactionData);
      setCategories(categoryData);
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
        loadData();
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
    loadData();
  };

  const handleFormCancel = () => {
    setShowTransactionForm(false);
    setEditingTransaction(null);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filters.type !== "all" && transaction.type !== filters.type) return false;
    if (filters.category !== "all" && transaction.category !== filters.category) return false;
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">All Transactions</h2>
          <p className="text-gray-600 mt-1">Manage your income and expenses</p>
        </div>
        <Button
          variant="primary"
          leftIcon="Plus"
          onClick={() => setShowTransactionForm(true)}
        >
          Add Transaction
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormField
            label="Search"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          
          <FormField
            label="Type"
            type="select"
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </FormField>
          
          <FormField
            label="Category"
            type="select"
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.Id} value={category.name}>
                {category.name}
              </option>
            ))}
          </FormField>
          
          <div className="flex items-end">
            <Button
              variant="outline"
              leftIcon="RotateCcw"
              onClick={() => setFilters({ type: "all", category: "all", search: "" })}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl card-shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Transactions ({filteredTransactions.length})
            </h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" leftIcon="Download">
                Export
              </Button>
              <Button variant="outline" size="sm" leftIcon="Filter">
                Filter
              </Button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTransactions.length === 0 ? (
            <div className="p-6">
              <Empty
                title="No Transactions Found"
                description="No transactions match your current filters. Try adjusting your search criteria or add a new transaction."
                action={() => setShowTransactionForm(true)}
                actionLabel="Add Transaction"
                icon="Receipt"
              />
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.Id} className="px-6">
                <TransactionItem
                  transaction={transaction}
                  onEdit={handleEditTransaction}
                  onDelete={handleDeleteTransaction}
                />
              </div>
            ))
          )}
        </div>
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

export default Transactions;