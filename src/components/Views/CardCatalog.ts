import { Card } from './Card';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export interface CardCatalogData {
  data: IProduct;
}

export class CardCatalog extends Card<CardCatalogData> {
  private product?: IProduct;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    container.addEventListener('click', () => {
      if (this.product) events.emit('card:select', this.product);
    });
  }

  set data(product: IProduct) {
    this.product = product;
    this.title = product.title;
    this.category = product.category;
    this.image = product.image;
    this.price = product.price;
  }
}