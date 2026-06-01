import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DataRetrievalModule } from './data-retrieval/data-retrieval.module';
import { DataInsertionModule } from './data-insertion/data-insertion.module';
import { ElasticsearchModule } from './shared/elasticsearch.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    DataRetrievalModule,
    DataInsertionModule,
    ElasticsearchModule,
    KafkaModule,
  ],
})
export class AppModule {}
