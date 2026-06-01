import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL,
    });
  }

  async indexDocument(index: string, document: any) {
    try {
      const response = await this.client.index({
        index,
        body: document,
      });
      console.log('Document indexed:', response);
    } catch (error) {
      console.error('Error indexing document:', error.message);
    }
  }
  async searchDocuments(index: string, query: any): Promise<any> {
    try {
      const response = await this.client.search({
        index,
        body: query,
      });
      console.log('Elasticsearch response:', response.hits.hits);
      return response.hits.hits;
    } catch (error) {
      console.error(
        'Error searching documents in Elasticsearch:',
        error.message,
      );
      throw error;
    }
  }
}
