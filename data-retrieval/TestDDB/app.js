const express = require('express')
const connectDB = require('./dbb')
const { User, createUser } = require('./models/User')

const app = express()
const port = 3000

app.use(express.json())

connectDB()

app.post('/users', async (req, res) => {
  try {
    const newUser = new User(req.body) // يتم استخدام البيانات القادمة من الطلب
    const result = await newUser.save()
    res.status(201).json(result)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})
createUser()
app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(port, () => {
  console.log('$Server running on http://localhost:${port}')
})
