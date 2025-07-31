import budgetsData from "@/services/mockData/budgets.json";

class BudgetService {
  constructor() {
    this.budgets = [...budgetsData];
  }

  async getAll() {
    await this.delay();
    return [...this.budgets];
  }

  async getById(id) {
    await this.delay();
    const budget = this.budgets.find(b => b.Id === parseInt(id));
    if (!budget) {
      throw new Error("Budget not found");
    }
    return { ...budget };
  }

  async create(budgetData) {
    await this.delay();
    const newId = Math.max(...this.budgets.map(b => b.Id)) + 1;
    const newBudget = {
      Id: newId,
      ...budgetData
    };
    this.budgets.push(newBudget);
    return { ...newBudget };
  }

  async update(id, budgetData) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Budget not found");
    }
    this.budgets[index] = {
      ...this.budgets[index],
      ...budgetData
    };
    return { ...this.budgets[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Budget not found");
    }
    const deletedBudget = this.budgets.splice(index, 1)[0];
    return { ...deletedBudget };
}

  async getAlerts() {
    await this.delay();
    // This would typically integrate with budgetAlertService
    return [];
  }

  async updateAlert(budgetId, alertSettings) {
    await this.delay();
    // This would update alert settings for a specific budget
    return { budgetId, ...alertSettings };
  }

  async createAlert(budgetId, alertData) {
    await this.delay();
    const newAlert = {
      Id: Date.now(),
      budgetId,
      ...alertData,
      createdAt: new Date().toISOString()
    };
    return newAlert;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new BudgetService();