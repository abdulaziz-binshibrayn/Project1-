require('dotenv').config()
const mongoose = require('mongoose')

console.log({
  uri: process.env.MONGO_URI,
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!')
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message)
    process.exit(1) // stop the service if the connection is failed.
  })

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true },
  created_date: { type: Date },
  updated_date: { type: Date },
  final_total: { type: Number },
  tax: { type: Number },
  establishment: { type: String },
})

const Orders = mongoose.model('orders', OrderSchema)

// clean up the function code
async function upsertData(orderData) {
  return Orders.findOneAndUpdate({ id: orderData.id }, orderData, {
    upsert: true,
  })
}

module.exports = { upsertData }
