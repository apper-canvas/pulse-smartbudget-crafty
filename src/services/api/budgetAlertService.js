import budgetService from "@/services/api/budgetService";
import transactionService from "@/services/api/transactionService";

class BudgetAlertService {
  constructor() {
    this.alertSettings = new Map();
    this.initializeDefaults();
  }

  initializeDefaults() {
    // Default alert settings
    this.defaultSettings = {
      warningThreshold: 80,
      errorThreshold: 100,
      enabled: true
    };
  }

  async checkBudgetAlerts() {
    await this.delay();
    const budgets = await budgetService.getAll();
    const transactions = await transactionService.getAll();
    const alerts = [];

    for (const budget of budgets) {
      const spent = transactions
        .filter(t => t.categoryId === budget.categoryId && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const spentPercentage = (spent / budget.monthlyLimit) * 100;
      const settings = this.getAlertSettings(budget.Id);

      if (!settings.enabled) continue;

      if (spentPercentage >= settings.errorThreshold) {
        alerts.push({
          Id: Date.now() + budget.Id,
          budgetId: budget.Id,
          type: 'error',
          message: `Budget exceeded for ${budget.category}`,
          percentage: spentPercentage,
          threshold: settings.errorThreshold
        });
      } else if (spentPercentage >= settings.warningThreshold) {
        alerts.push({
          Id: Date.now() + budget.Id,
          budgetId: budget.Id,
          type: 'warning',
          message: `Budget alert for ${budget.category}`,
          percentage: spentPercentage,
          threshold: settings.warningThreshold
        });
      }
    }

    return alerts;
  }

  getAlertSettings(budgetId) {
    return this.alertSettings.get(budgetId) || this.defaultSettings;
  }

  async updateAlertSettings(budgetId, settings) {
    await this.delay();
    this.alertSettings.set(budgetId, { ...this.defaultSettings, ...settings });
    return this.getAlertSettings(budgetId);
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }
}

export default new BudgetAlertService();