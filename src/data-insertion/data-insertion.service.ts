import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaService } from 'src/kafka/kafka.service';
import { ElasticsearchService } from '../shared/elasticsearch.service';
import { DbService } from './db/db.service';
import { getErrorMessage } from '../shared/error-message.util';

@Injectable()
export class DataInsertionService implements OnModuleInit {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly dbService: DbService,
    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async onModuleInit(): Promise<void> {
  if (process.env.SERVICE_ROLE !== 'insertion') {
    console.log('Kafka consumer disabled: this is not data-insertion service');
    return;
  }

  await this.kafkaService.listenToMessages(this.handleMessage.bind(this));
}

  private async handleMessage(data: string): Promise<void> {
    try {
      console.log('Handler triggered');

      const parsedData = JSON.parse(data);

      if (!parsedData.objects || !Array.isArray(parsedData.objects)) {
        console.error('Invalid data format:', parsedData);
        return;
      }

      for (const orderData of parsedData.objects) {
        console.log('Inserting/updating order in MongoDB');

        await this.dbService.upsertData(orderData);

        console.log('Indexing order in Elasticsearch:', orderData);
        await this.elasticsearchService.indexDocument('orders', orderData);
      }
    } catch (error) {
      console.error('Error handling Kafka message:', getErrorMessage(error));
    }
  }

  async searchOrders(query: string): Promise<unknown> {
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