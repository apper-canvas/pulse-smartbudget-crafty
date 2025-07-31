import React, { useState, useEffect } from "react";
import GoalCard from "@/components/molecules/GoalCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { formatDateInput } from "@/utils/dateHelpers";
import goalService from "@/services/api/goalService";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: ""
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await goalService.getAll();
      setGoals(data);
    } catch (err) {
      setError("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const goalData = {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0
      };
      
      if (editingGoal) {
        await goalService.update(editingGoal.Id, goalData);
        toast.success("Goal updated successfully!");
      } else {
        await goalService.create(goalData);
        toast.success("Goal created successfully!");
      }
      
      setShowGoalForm(false);
      setEditingGoal(null);
      setFormData({ name: "", targetAmount: "", currentAmount: "", deadline: "" });
      loadGoals();
    } catch (error) {
      toast.error(editingGoal ? "Failed to update goal" : "Failed to create goal");
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: formatDateInput(goal.deadline)
    });
    setShowGoalForm(true);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        await goalService.delete(goalId);
        toast.success("Goal deleted successfully!");
        loadGoals();
      } catch (error) {
        toast.error("Failed to delete goal");
      }
    }
  };

  const handleCancel = () => {
    setShowGoalForm(false);
    setEditingGoal(null);
    setFormData({ name: "", targetAmount: "", currentAmount: "", deadline: "" });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadGoals} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Savings Goals</h2>
          <p className="text-gray-600 mt-1">Track your progress towards financial milestones</p>
        </div>
        <Button
          variant="primary"
          leftIcon="Plus"
          onClick={() => setShowGoalForm(true)}
        >
          Create Goal
        </Button>
      </div>

      {/* Goal Form */}
      {showGoalForm && (
        <div className="bg-white rounded-xl p-6 card-shadow animate-scale-up">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingGoal ? "Edit Goal" : "Create New Goal"}
            </h3>
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Goal Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Target Amount"
                type="number"
                value={formData.targetAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              
              <FormField
                label="Current Amount"
                type="number"
                value={formData.currentAmount}
                onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            
            <FormField
              label="Target Date"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              required
            />
            
            <div className="flex space-x-4">
              <Button
                type="submit"
                variant="primary"
                leftIcon={editingGoal ? "Save" : "Plus"}
                className="flex-1"
              >
                {editingGoal ? "Update Goal" : "Create Goal"}
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

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-xl p-6 card-shadow">
          <Empty
            title="No Savings Goals"
            description="Create your first savings goal to start tracking your progress towards financial milestones."
            action={() => setShowGoalForm(true)}
            actionLabel="Create Goal"
            icon="Target"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.Id}
              goal={goal}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Goals;