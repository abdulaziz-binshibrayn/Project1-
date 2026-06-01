import { Module } from '@nestjs/common';
import { DataRetrievalService } from './data-retrieval.service';
import { DataRetrievalController } from './data-retieval.conroller';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  providers: [DataRetrievalService],
  controllers: [DataRetrievalController],
})
export class DataRetrievalModule {}
