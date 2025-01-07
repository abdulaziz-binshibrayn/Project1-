require('dotenv').config()
const { consumer } = require('./kafka')
const { upsertData } = require('./db')

// (consumer) masege from kafka topic
async function startConsumer() {
  try {
    await consumer.connect()
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC })

    console.log('Consumer connected to Kafka::')

    await consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString())
        for (const orderData of data.objects) {
          await upsertData(orderData)
        }
      },
    })
  } catch (error) {
    console.error('there is Error message in catch:', error.message)
  }
}
startConsumer().catch(console.error)
