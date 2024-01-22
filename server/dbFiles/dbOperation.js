const config                    = require('./dbConfigs')
      sql                       = require('mssql');

      const getEmployees = async () => {

        try {
      
          let pool = await sql.connect(config);
      
          // Await the query promise
          let result = await pool.request().query("SELECT * FROM EmployeeDemographics");
      
          return result.recordset;
      
        } catch(error) {
          console.log(error);
        }
      
      };

  module.exports = {
    getEmployees
  }