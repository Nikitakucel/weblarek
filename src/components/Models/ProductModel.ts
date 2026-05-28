import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class ProductModel {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(private events: EventEmitter) {}

  setItems(products: IProduct[]): void {
    this.items = products;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(product => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit('product:selected');
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}