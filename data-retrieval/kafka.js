require('dotenv').config()
const { Kafka } = require('kafkajs')

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] })

const producer = kafka.producer()

producer
  .connect()
  .then(() => {
    console.log('Kafka as producer connected')
  })
  .catch((e) => {
    console.log('Failed to connect to kafka as producer:', e)
    process.exit(1) // stop the service if the connection is failed.
  })

module.exports = {
  kafka,
  producer,
}
