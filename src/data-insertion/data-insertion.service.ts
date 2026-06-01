import { Injectable, OnModuleInit } from '@nestjs/common';
import { DbService } from './db/db.service';
import { ElasticsearchService } from '../shared/elasticsearch.service';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class DataInsertionService implements OnModuleInit {
  constructor(
    private readonly KafkaService: KafkaService,
    private readonly dbService: DbService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.KafkaService.listenToMessages(this.handleMessage.bind(this));
  }

  /**
    @param data 
   */
  private async handleMessage(data: string): Promise<void> {
    try {
      console.log('Handler triggered:');

      const parsedData = JSON.parse(data);

      if (!parsedData.objects || !Array.isArray(parsedData.objects)) {
        console.error('Invalid data format:', parsedData);
        return;
      }

      for (const orderData of parsedData.objects) {
        console.log('Inserting/updating order in MongoDB:');

        await this.dbService.upsertData(orderData);

        console.log('Indexing order in Elasticsearch:', orderData);
        await this.elasticsearchService.indexDocument('orders', orderData);
      }
    } catch (error) {
      console.error('Error handling Kafka message:', error.message);
    }
  }

  async searchOrders(query: string): Promise<any> {
    const searchQuery = {
      query: {
        match: { id: query },
      },
    };
    return await this.elasticsearchService.searchDocuments(
      'orders',
      searchQuery,
    );
  }
}
