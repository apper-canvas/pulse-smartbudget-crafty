class GoalService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'goal_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "targetAmount_c" } },
          { "field": { "Name": "currentAmount_c" } },
          { "field": { "Name": "deadline_c" } },
          { "field": { "Name": "createdAt_c" } }
        ],
        orderBy: [
          {
            "fieldName": "createdAt_c",
            "sorttype": "DESC"
          }
        ]
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      // Transform database field names to UI field names
      return response.data.map(goal => ({
        Id: goal.Id,
        name: goal.Name,
        targetAmount: goal.targetAmount_c,
        currentAmount: goal.currentAmount_c,
        deadline: goal.deadline_c,
        createdAt: goal.createdAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching goals:", error?.response?.data?.message);
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
          { "field": { "Name": "targetAmount_c" } },
          { "field": { "Name": "currentAmount_c" } },
          { "field": { "Name": "deadline_c" } },
          { "field": { "Name": "createdAt_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Goal not found");
      }

      // Transform database field names to UI field names
      return {
        Id: response.data.Id,
        name: response.data.Name,
        targetAmount: response.data.targetAmount_c,
        currentAmount: response.data.currentAmount_c,
        deadline: response.data.deadline_c,
        createdAt: response.data.createdAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching goal with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(goalData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Name: goalData.name,
          targetAmount_c: parseFloat(goalData.targetAmount),
          currentAmount_c: parseFloat(goalData.currentAmount) || 0,
          deadline_c: goalData.deadline,
          createdAt_c: new Date().toISOString()
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
          console.error(`Failed to create goals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create goal");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            name: successfulRecord.data.Name,
            targetAmount: successfulRecord.data.targetAmount_c,
            currentAmount: successfulRecord.data.currentAmount_c,
            deadline: successfulRecord.data.deadline_c,
            createdAt: successfulRecord.data.createdAt_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating goal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, goalData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: goalData.name,
          targetAmount_c: parseFloat(goalData.targetAmount),
          currentAmount_c: parseFloat(goalData.currentAmount) || 0,
          deadline_c: goalData.deadline
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
          console.error(`Failed to update goals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update goal");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            name: successfulRecord.data.Name,
            targetAmount: successfulRecord.data.targetAmount_c,
            currentAmount: successfulRecord.data.currentAmount_c,
            deadline: successfulRecord.data.deadline_c,
            createdAt: successfulRecord.data.createdAt_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating goal:", error?.response?.data?.message);
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
          console.error(`Failed to delete goals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete goal");
        }

        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting goal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export default new GoalService();

export default new GoalService();