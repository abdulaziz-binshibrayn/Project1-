import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ collection: 'orders' })
export class Order {
  @Prop({ required: true })
  id: string;

  @Prop()
  created_date: Date;

  @Prop()
  updated_date: Date;

  @Prop()
  final_total: number;

  @Prop()
  tax: number;

  @Prop()
  establishment: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
