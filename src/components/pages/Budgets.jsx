import React, { useState, useEffect } from "react";
import BudgetCard from "@/components/molecules/BudgetCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { getCurrentMonth } from "@/utils/dateHelpers";
import budgetService from "@/services/api/budgetService";
import categoryService from "@/services/api/categoryService";
import transactionService from "@/services/api/transactionService";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    monthlyLimit: "",
    period: getCurrentMonth()
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [budgetData, categoryData, transactionData] = await Promise.all([
        budgetService.getAll(),
        categoryService.getAll(),
        transactionService.getAll()
      ]);
      
      // Calculate spent amounts for each budget
      const budgetsWithSpent = budgetData.map(budget => {
        const spent = transactionData
          .filter(t => t.type === "expense" && t.category === budget.category)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        return { ...budget, spent };
      });
      
      setBudgets(budgetsWithSpent);
      setCategories(categoryData.filter(c => c.type === "expense"));
    } catch (err) {
      setError("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category || !formData.monthlyLimit) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const budgetData = {
        ...formData,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        spent: 0
      };
      
      if (editingBudget) {
        await budgetService.update(editingBudget.Id, budgetData);
        toast.success("Budget updated successfully!");
      } else {
        await budgetService.create(budgetData);
        toast.success("Budget created successfully!");
      }
      
      setShowBudgetForm(false);
      setEditingBudget(null);
      setFormData({ category: "", monthlyLimit: "", period: getCurrentMonth() });
      loadData();
    } catch (error) {
      toast.error(editingBudget ? "Failed to update budget" : "Failed to create budget");
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      monthlyLimit: budget.monthlyLimit.toString(),
      period: budget.period
    });
    setShowBudgetForm(true);
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await budgetService.delete(budgetId);
        toast.success("Budget deleted successfully!");
        loadData();
      } catch (error) {
        toast.error("Failed to delete budget");
      }
    }
  };

  const handleCancel = () => {
    setShowBudgetForm(false);
    setEditingBudget(null);
    setFormData({ category: "", monthlyLimit: "", period: getCurrentMonth() });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const availableCategories = categories.filter(category => 
    !budgets.some(budget => budget.category === category.name) || 
    (editingBudget && editingBudget.category === category.name)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Budget Management</h2>
          <p className="text-gray-600 mt-1">Set and track your spending limits</p>
        </div>
        <Button
          variant="primary"
          leftIcon="Plus"
          onClick={() => setShowBudgetForm(true)}
        >
          Create Budget
        </Button>
      </div>

      {/* Budget Form */}
      {showBudgetForm && (
        <div className="bg-white rounded-xl p-6 card-shadow animate-scale-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingBudget ? "Edit Budget" : "Create New Budget"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Category"
                type="select"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="">Select a category</option>
                {availableCategories.map((category) => (
                  <option key={category.Id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </FormField>
              
              <FormField
                label="Monthly Limit"
                type="number"
                value={formData.monthlyLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, monthlyLimit: e.target.value }))}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <FormField
              label="Period"
              value={formData.period}
              onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value }))}
              placeholder="e.g., January 2024"
              required
            />
            
            <div className="flex space-x-4">
              <Button
                type="submit"
                variant="primary"
                leftIcon={editingBudget ? "Save" : "Plus"}
                className="flex-1"
              >
                {editingBudget ? "Update Budget" : "Create Budget"}
              </Button>
              
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets Grid */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-xl p-6 card-shadow">
          <Empty
            title="No Budgets Set"
            description="Create your first budget to start tracking your spending limits and stay on top of your finances."
            action={() => setShowBudgetForm(true)}
            actionLabel="Create Budget"
            icon="PieChart"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.Id}
              budget={budget}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Budgets;