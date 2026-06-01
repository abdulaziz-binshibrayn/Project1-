require('dotenv').config()
const { consumer } = require('./kafka')
const { upsertData } = require('./db')

// استهلاك الرسائل من Kafka وتخزينها في MongoDB
async function startConsumer() {
  try {
    await consumer.connect()
    await consumer.subscribe({
      topic: process.env.KAFKA_TOPIC,
      fromBeginning: true,
    })

    console.log('Consumer connected to Kafka')

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const data = JSON.parse(message.value.toString())

          if (
            !data.objects ||
            !Array.isArray(data.objects) ||
            data.objects.length === 0
          ) {
            console.error('No valid objects in the Kafka message')
            return
          }

          for (const orderData of data.objects) {
            await upsertData(orderData)
          }
        } catch (error) {
          console.error('Error processing Kafka message:', error.message)
        }
      },
    })
  } catch (error) {
    console.error('Error in consumer:', error.message)
  }
}

startConsumer().catch(console.error)
