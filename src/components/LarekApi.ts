import { Api } from './base/Api';
import { IOrder, IOrderResponse, IProductsResponse } from '../types';
import { API_URL } from '../utils/constants';

export class LarekApi {
  private api: Api;

  constructor() {
    this.api = new Api(API_URL);
  }

  getProducts(): Promise<IProductsResponse> {
    return this.api.get('/product');
  }

  postOrder(order: IOrder): Promise<IOrderResponse> {
    return this.api.post('/order', order);
  }
}