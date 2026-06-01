import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({ brokers: [process.env.KAFKA_BROKER] });
  private readonly producer = this.kafka.producer();
  private readonly consumer: Consumer = this.kafka.consumer({
    groupId: 'data-insertion-group',
  });

  async onModuleInit(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('Kafka as producer connected');

      await this.consumer.connect();
      console.log('Kafka consumer connected');

      await this.consumer.subscribe({
        topic: process.env.KAFKA_TOPIC,
        fromBeginning: true,
      });
      console.log('Subscribed to topic:');
    } catch (error) {
      console.error('Error initializing Kafka:', error.message);
    }
  }

  async sendToKafka(data: any): Promise<void> {
    try {
      await this.producer.send({
        topic: process.env.KAFKA_TOPIC,
        messages: [{ value: JSON.stringify(data) }],
      });
      console.log('Data sent to Kafka topic');
    } catch (error) {
      console.error('Error sending data to Kafka:', error.message);
    }
  }

  async listenToMessages(
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();
          console.log('Raw Kafka message received...');
          if (value) {
            await callback(value);
          }
        },
      });
    } catch (error) {
      console.error('Error in Kafka consumer run:', error.message);
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log('Kafka producer disconnected');

      await this.consumer.disconnect();
      console.log('Kafka consumer disconnected');
    } catch (error) {
      console.error('Error disconnecting Kafka:', error.message);
    }
  }
}
