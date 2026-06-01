import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { getErrorMessage } from '../shared/error-message.util';
import { DataRetrievalService } from './data-retrieval.service';

@Controller()
export class DataRetrievalController {
  constructor(private readonly dataRetrievalService: DataRetrievalService) {}

  @Post('/')
  async triggerFetchData(@Res() res: Response) {
    try {
      await this.dataRetrievalService.fetchData();
      return res.send('success');
    } catch (error) {
      return res.status(400).json({
        message: getErrorMessage(error),
      });
    }
  }
}