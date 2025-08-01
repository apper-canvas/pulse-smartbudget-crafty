import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatDateInput } from "@/utils/dateHelpers";
import transactionService from "@/services/api/transactionService";
import categoryService from "@/services/api/categoryService";

const TransactionForm = ({ transaction, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: formatDateInput(new Date())
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: formatDateInput(transaction.date)
      });
    }
  }, [transaction]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (transaction) {
        await transactionService.update(transaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await transactionService.create(transactionData);
        toast.success("Transaction added successfully!");
      }
      
      onSuccess();
    } catch (error) {
      toast.error(transaction ? "Failed to update transaction" : "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="bg-white rounded-xl p-6 card-shadow animate-scale-up">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {transaction ? "Edit Transaction" : "Add New Transaction"}
        </h2>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Type"
            type="select"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </FormField>
          
          <FormField
            label="Amount"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            error={errors.amount}
          />
        </div>
        
        <FormField
          label="Category"
          type="select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          error={errors.category}
        >
          <option value="">Select a category</option>
          {filteredCategories.map((category) => (
<option key={category.Id} value={category.name}>
              {category.name}
            </option>
          ))}
        </FormField>
        
        <FormField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter transaction description"
          required
          error={errors.description}
        />
        
        <FormField
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          error={errors.date}
        />
        
        <div className="flex space-x-4 pt-4">
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            leftIcon={transaction ? "Save" : "Plus"}
            className="flex-1"
          >
            {transaction ? "Update Transaction" : "Add Transaction"}
          </Button>
          
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;