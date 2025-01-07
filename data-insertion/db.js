require('dotenv').config()
const { Sequelize } = require('sequelize')

// function to call (stored procedure)
async function upsertData(orderData) {
  try {
    await sequelize.authenticate()
    console.log('Database Connected')

    await sequelize.query(
      'EXEC demo.UpsertOrder @id = :id, @customer_name = :customer_name, @created_date = :created_date, @updated_date = :updated_date, @sub_total = :sub_total, @final_total = :final_total, @tax = :tax, @has_items = :has_items, @establishment = :establishment, @table = :table',
      {
        replacements: {
          id: orderData.id,
          customer_name: orderData.customer,
          created_date: orderData.created_date,
          updated_date: orderData.updated_date,
          sub_total: orderData.subtotal,
          final_total: orderData.final_total,
          tax: orderData.tax,
          has_items: orderData.has_items,
          establishment: orderData.establishment,
          table: orderData.table,
        },
      },
    )
    console.log('Data inserted in table Orders.')
  } catch (error) {
    console.error('Error inserting data:', error.message)
  }
}

//configer database using (Sequelize)
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mssql',
    dialectOptions: { options: { encrypt: true } },
  },
)

module.exports = { sequelize, upsertData }
