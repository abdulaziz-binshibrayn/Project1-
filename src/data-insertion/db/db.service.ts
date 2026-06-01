import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class DbService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async upsertData(orderData: any): Promise<void> {
    try {
      console.log('Hena ttakd itha al bataksjdnfb.....');
      await this.orderModel.findOneAndUpdate({ id: orderData.id }, orderData, {
        upsert: true,
        new: true,
      });
      console.log('Order data inserted/updated in MongoDB');
    } catch (error) {
      console.error('Error inserting/updating MongoDB:', error.message);
    }
  }
}
