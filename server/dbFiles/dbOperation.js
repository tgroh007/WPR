const config                    = require('./dbConfigs')
      sql                       = require('mssql');

      const getEmployees = async () => {

        try {
      
          let pool = await sql.connect(config);
      
          // Await the query promise removes the need for a.then()
          // let result = await pool.request().query("SELECT * FROM EmployeeDemographics");
          let result = await pool.request().query("SELECT * FROM spokane.city");
      
          return result.recordset;
      
        } catch(error) {
          console.log(error);
        }
      
      };

  module.exports = {
    getEmployees
  }