import { Module } from '@nestjs/common';
import { DataInsertionService } from './data-insertion.service';
import { DbService } from './db/db.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from './db/schemas/order.schema';
import { ElasticsearchModule } from 'src/shared/elasticsearch.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    KafkaModule,
    ElasticsearchModule,
  ],
  providers: [DataInsertionService, DbService],
  exports: [DataInsertionService],
})
export class DataInsertionModule {}
