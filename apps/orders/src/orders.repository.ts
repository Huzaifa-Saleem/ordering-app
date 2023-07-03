import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Orders } from './schemas/order.schema';

@Injectable()
export class OrdersRepository extends AbstractRepository<Orders> {
  protected readonly logger = new Logger(OrdersRepository.name);

  constructor(
    @InjectModel(Orders.name) orderModel: Model<Orders>,
    @InjectConnection() connection: Connection,
  ) {
    super(orderModel, connection);
  }
}
