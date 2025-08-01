class TransactionService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'transaction_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "type_c" } },
          { "field": { "Name": "amount_c" } },
          { "field": { "Name": "category_c" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "date_c" } },
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
      return response.data.map(transaction => ({
        Id: transaction.Id,
        type: transaction.type_c,
        amount: transaction.amount_c,
        category: transaction.category_c,
        description: transaction.description_c,
        date: transaction.date_c,
        createdAt: transaction.createdAt_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching transactions:", error?.response?.data?.message);
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
          { "field": { "Name": "type_c" } },
          { "field": { "Name": "amount_c" } },
          { "field": { "Name": "category_c" } },
          { "field": { "Name": "description_c" } },
          { "field": { "Name": "date_c" } },
          { "field": { "Name": "createdAt_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Transaction not found");
      }

      // Transform database field names to UI field names
      return {
        Id: response.data.Id,
        type: response.data.type_c,
        amount: response.data.amount_c,
        category: response.data.category_c,
        description: response.data.description_c,
        date: response.data.date_c,
        createdAt: response.data.createdAt_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching transaction with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(transactionData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Name: transactionData.description, // Use description as Name
          type_c: transactionData.type,
          amount_c: parseFloat(transactionData.amount),
          category_c: transactionData.category,
          description_c: transactionData.description,
          date_c: transactionData.date,
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
          console.error(`Failed to create transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create transaction");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            type: successfulRecord.data.type_c,
            amount: successfulRecord.data.amount_c,
            category: successfulRecord.data.category_c,
            description: successfulRecord.data.description_c,
            date: successfulRecord.data.date_c,
            createdAt: successfulRecord.data.createdAt_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating transaction:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, transactionData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: transactionData.description, // Use description as Name
          type_c: transactionData.type,
          amount_c: parseFloat(transactionData.amount),
          category_c: transactionData.category,
          description_c: transactionData.description,
          date_c: transactionData.date
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
          console.error(`Failed to update transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update transaction");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            type: successfulRecord.data.type_c,
            amount: successfulRecord.data.amount_c,
            category: successfulRecord.data.category_c,
            description: successfulRecord.data.description_c,
            date: successfulRecord.data.date_c,
            createdAt: successfulRecord.data.createdAt_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating transaction:", error?.response?.data?.message);
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
          console.error(`Failed to delete transactions ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete transaction");
        }

        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting transaction:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export default new TransactionService();