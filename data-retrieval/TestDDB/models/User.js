const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: true },
  age: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model('User', userSchema)

async function createUser() {
  try {
    const newUser = new User({
      name: 'JalsWER',
      email: 'Ajal@gmail.com',
      age: 33,
    })

    const result = await newUser.save()
    console.log('User added successfully:', result)
  } catch (err) {
    console.error('Error adding user:', err.message)
  }
}

module.exports = { User, createUser }
