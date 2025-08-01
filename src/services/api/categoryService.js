class CategoryService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "type_c" } },
          { "field": { "Name": "icon_c" } },
          { "field": { "Name": "color_c" } }
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
      return response.data.map(category => ({
        Id: category.Id,
        name: category.Name,
        type: category.type_c,
        icon: category.icon_c,
        color: category.color_c
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching categories:", error?.response?.data?.message);
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
          { "field": { "Name": "icon_c" } },
          { "field": { "Name": "color_c" } }
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Category not found");
      }

      // Transform database field names to UI field names
      return {
        Id: response.data.Id,
        name: response.data.Name,
        type: response.data.type_c,
        icon: response.data.icon_c,
        color: response.data.color_c
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching category with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(categoryData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Name: categoryData.name,
          type_c: categoryData.type,
          icon_c: categoryData.icon,
          color_c: categoryData.color
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
          console.error(`Failed to create categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to create category");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            name: successfulRecord.data.Name,
            type: successfulRecord.data.type_c,
            icon: successfulRecord.data.icon_c,
            color: successfulRecord.data.color_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, categoryData) {
    try {
      // Transform UI field names to database field names and include only Updateable fields
      const params = {
        records: [{
          Id: parseInt(id),
          Name: categoryData.name,
          type_c: categoryData.type,
          icon_c: categoryData.icon,
          color_c: categoryData.color
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
          console.error(`Failed to update categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to update category");
        }

        const successfulRecord = response.results.find(result => result.success);
        if (successfulRecord) {
          // Transform back to UI field names
          return {
            Id: successfulRecord.data.Id,
            name: successfulRecord.data.Name,
            type: successfulRecord.data.type_c,
            icon: successfulRecord.data.icon_c,
            color: successfulRecord.data.color_c
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating category:", error?.response?.data?.message);
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
          console.error(`Failed to delete categories ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error("Failed to delete category");
        }

        return true;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting category:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export default new CategoryService();
export default new CategoryService();