import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel {
  private items: IProduct[] = [];

  constructor(private events: EventEmitter) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    if (!this.hasItem(product.id)) {
      this.items.push(product);
      this.events.emit('cart:changed', this.items);
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.id !== productId);
    this.events.emit('cart:changed', this.items);
  }

  clear(): void {
    this.items = [];
    this.events.emit('cart:changed', this.items);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(productId: string): boolean {
    return this.items.some(item => item.id === productId);
  }
}