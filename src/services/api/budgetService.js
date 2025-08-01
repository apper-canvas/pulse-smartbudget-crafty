class BudgetService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'budget_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "category_c" } },
          { "field": { "Name": "monthlyLimit_c" } },
          { "field": { "Name": "period_c" } },
          { "field": { "Name": "spent_c" } }
        ],
        orderBy: [
          {
            "fieldName": "Name",
            "sorttype": "ASC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(budget => ({
        Id: budget.Id,
        category: budget.category_c,
        monthlyLimit: budget.monthlyLimit_c,
        period: budget.period_c,
        spent: budget.spent_c || 0
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching budgets:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "category_c" } },
          { "field": { "Name": "monthlyLimit_c" } },
          { "field": { "Name": "period_c" } },
          { "field": { "Name": "spent_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Budget not found");
      }

      // Transform database field names to UI field names
      return {
        Id: response.data.Id,
        category: response.data.category_c,
        monthlyLimit: response.data.monthlyLimit_c,
        period: response.data.period_c,
        spent: response.data.spent_c || 0
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching budget with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(budgetData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Name: budgetData.category, // Use category as Name
          category_c: budgetData.category,
          monthlyLimit_c: parseFloat(budgetData.monthlyLimit),
          period_c: budgetData.period,
          spent_c: parseFloat(budgetData.spent) || 0
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create budgets ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create budget");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            category: successfulRecord.data.category_c,
            monthlyLimit: successfulRecord.data.monthlyLimit_c,
            period: successfulRecord.data.period_c,
            spent: successfulRecord.data.spent_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating budget:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, budgetData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: budgetData.category, // Use category as Name
          category_c: budgetData.category,
          monthlyLimit_c: parseFloat(budgetData.monthlyLimit),
          period_c: budgetData.period,
          spent_c: parseFloat(budgetData.spent) || 0
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update budgets ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update budget");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            category: successfulRecord.data.category_c,
            monthlyLimit: successfulRecord.data.monthlyLimit_c,
            period: successfulRecord.data.period_c,
            spent: successfulRecord.data.spent_c || 0
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating budget:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete budgets ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete budget");
        }

        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting budget:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getAlerts() {
    // This would typically integrate with budgetAlertService
    return [];
  }

  async updateAlert(budgetId, alertSettings) {
    // This would update alert settings for a specific budget
    return { budgetId, ...alertSettings };
  }

  async createAlert(budgetId, alertData) {
    const newAlert = {
      Id: Date.now(),
      budgetId,
      ...alertData,
      createdAt: new Date().toISOString()
    };
    return newAlert;
  }
}

export default new BudgetService();