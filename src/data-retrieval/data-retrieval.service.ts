import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import axios from 'axios';

@Injectable()
export class DataRetrievalService {
  constructor(private readonly KafkaService: KafkaService) {}

  async fetchData(): Promise<void> {
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
      });

      console.log('Data fetched successfully:');
      await this.KafkaService.sendToKafka(response.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }
}
