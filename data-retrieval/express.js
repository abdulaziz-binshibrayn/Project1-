const express = require('express')

const app = express()
const port = 3000
let dataArr = []

app.get('/', (req, res) => res.json(dataArr))

function startExpressServer() {
  app.listen(port, () => {
    console.log('Express server is running on port 3000')
  })
}

function updateData(newData) {
  dataArr = newData
}

module.exports = { startExpressServer, updateData }
