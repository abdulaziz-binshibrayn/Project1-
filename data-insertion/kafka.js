require('dotenv').config()
const { Kafka } = require('kafkajs')

const kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] })

const consumer = kafka.consumer({ groupId: 'data-insertion-group' })

module.exports = {
  kafka,
  consumer,
}
