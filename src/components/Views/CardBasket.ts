import { Card } from './Card';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export interface CardBasketData {
  data: IProduct;
  index: number;
}

export class CardBasket extends Card<CardBasketData> {
  private indexElement: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter, product: IProduct) {
    super(container);
    this.indexElement = container.querySelector('.basket__item-index')!;
    const deleteBtn = container.querySelector('.basket__item-delete')!;
    deleteBtn.addEventListener('click', () => events.emit('basket:remove', product));
  }

  set index(value: number) {
    this.indexElement.textContent = String(value + 1);
  }

  set data(product: IProduct) {
    this.title = product.title;
    this.price = product.price;
  }
}