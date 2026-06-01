require('dotenv').config()
const axios = require('axios')
const { producer } = require('./kafka')
const { startExpressServer } = require('./express')

async function sendToKafka(data) {
  try {
    await producer.send({
      topic: process.env.KAFKA_TOPIC,
      messages: [{ value: JSON.stringify(data) }],
    })
    console.log('Data sent to Kafka topic')
  } catch (error) {
    console.error('Error sending data to Kafka:', error.message)
  } finally {
    await producer.disconnect()
  }
}

async function fetchData() {
  try {
    const response = await axios.get(process.env.API_URL, {
      params: {
        establishment: 1,
        created_date__gte: '2024-12-01',
        created_date__lte: '2024-12-05',
        limit: 20,
      },
      headers: {
        'API-AUTHENTICATION': process.env.API_KEY,
      },
    })

    console.log('Data fetched successfully:')
    await sendToKafka(response.data) // sending data to kafka broker
  } catch (error) {
    console.error('Error fetching data:', error.message)
  }
}

const app = startExpressServer() // using the app instance to expose API endpoints

// Exposing an API endpoint to trigger the data fetching.
app.post('/', async (req, res) => {
  try {
    await fetchData()
    return res.send('success')
  } catch (error) {
    return res.status(400).json(error)
  }
})
