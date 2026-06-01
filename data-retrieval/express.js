const express = require('express')

const app = express()
const port = 3000

function startExpressServer() {
  app.listen(port, () => {
    console.log('Express server is running on port 3000')
  })

  return app // returning the app instance to re-use it.
}

module.exports = { startExpressServer }
