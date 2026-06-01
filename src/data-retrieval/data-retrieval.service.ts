import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { KafkaService } from '../kafka/kafka.service';
import { getErrorMessage } from '../shared/error-message.util';

@Injectable()
export class DataRetrievalService {
  constructor(private readonly kafkaService: KafkaService) {}

  async fetchData(): Promise<void> {
    try {
      const response = await axios.get(process.env.API_URL || '', {
        params: {
          establishment: 1,
          created_date__gte: '2024-12-01',
          created_date__lte: '2024-12-05',
          limit: 20,
        },
        headers: {
          'API-AUTHENTICATION': process.env.API_KEY,
        },
      });

      console.log('Data fetched successfully');
      await this.kafkaService.sendToKafka(response.data);
    } catch (error) {
      console.error('Error fetching data:', getErrorMessage(error));
    }
  }
}