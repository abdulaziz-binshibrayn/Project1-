import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Consumer, Kafka } from 'kafkajs';
import { getErrorMessage } from '../shared/error-message.util';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private readonly kafka = new Kafka({
    brokers: [process.env.KAFKA_BROKER || 'kafka:9092'],
  });

  private readonly producer = this.kafka.producer();

  private readonly consumer: Consumer = this.kafka.consumer({
    groupId: 'data-insertion-group',
  });

  async onModuleInit(): Promise<void> {
    try {
      await this.producer.connect();
      console.log('Kafka producer connected');

      await this.consumer.connect();
      console.log('Kafka consumer connected');

      await this.consumer.subscribe({
        topic: process.env.KAFKA_TOPIC || 'data_pipeline_topic',
        fromBeginning: true,
      });

      console.log(`Subscribed to topic: ${process.env.KAFKA_TOPIC}`);
    } catch (error) {
      console.error('Error initializing Kafka:', getErrorMessage(error));
    }
  }

  async sendToKafka(data: unknown): Promise<void> {
    try {
      await this.producer.send({
        topic: process.env.KAFKA_TOPIC || 'data_pipeline_topic',
        messages: [{ value: JSON.stringify(data) }],
      });

      console.log('Data sent to Kafka topic');
    } catch (error) {
      console.error('Error sending data to Kafka:', getErrorMessage(error));
    }
  }

  async listenToMessages(
    callback: (message: string) => Promise<void>,
  ): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ message }) => {
          const value = message.value?.toString();

          console.log('Raw Kafka message received');

          if (value) {
            await callback(value);
          }
        },
      });
    } catch (error) {
      console.error('Error in Kafka consumer run:', getErrorMessage(error));
    }
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log('Kafka producer disconnected');

      await this.consumer.disconnect();
      console.log('Kafka consumer disconnected');
    } catch (error) {
      console.error('Error disconnecting Kafka:', getErrorMessage(error));
    }
  }
}