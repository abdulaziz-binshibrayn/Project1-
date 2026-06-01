const mongoose = require('mongoose')

const mongoURI = 'mongodb://127.0.0.1:27017/mydatabase'

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB successfully!')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message)
    process.exit(1)
  }
}

module.exports = connectDB
