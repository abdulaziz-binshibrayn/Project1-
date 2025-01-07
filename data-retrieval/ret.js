require('dotenv').config()
const axios = require('axios')
const { producer } = require('./kafka')
const { updateData, startExpressServer } = require('./express')

async function sendToKafka(data) {
  try {
    await producer.connect()

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
        limit: 300,
      },
      headers: {
        'API-AUTHENTICATION': process.env.API_KEY,
      },
    })

    console.log('Data fetched successfully:')
    updateData(response.data)
    await sendToKafka(response.data)
  } catch (error) {
    console.error('Error fetching data:', error.message)
  }
}

startExpressServer()

fetchData()
