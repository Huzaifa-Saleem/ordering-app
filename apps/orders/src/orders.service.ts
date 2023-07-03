import { Inject, Injectable } from '@nestjs/common';
import { CreateOrderRequest } from './dto/createOrderRequest.dto';
import { OrdersRepository } from './orders.repository';
import { BILLING_SERVICE } from './constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async createOrder(request: CreateOrderRequest) {
    const sessions = await this.ordersRepository.startTransaction();
    try {
      const order = await this.ordersRepository.create(request, {
        session: sessions,
      });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );
      await sessions.commitTransaction();
      return order;
    } catch (error) {
      await sessions.abortTransaction();
      throw error;
    }
  }

  async getOrders() {
    return await this.ordersRepository.find({});
  }
}
