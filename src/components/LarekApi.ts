import { IApi } from '../types';
import { IOrder, IOrderResponse, IProductsResponse } from '../types';

export class LarekApi {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get('/product');
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post('/order', order);
  }
}