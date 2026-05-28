import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface BasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<BasketData> {
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.listElement = ensureElement('.basket__list', this.container);
    this.totalElement = ensureElement('.basket__price', this.container);
    this.orderButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;

    this.orderButton.addEventListener('click', () => events.emit('order:start'));
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this.listElement.innerHTML = '<p class="basket__empty">Корзина пуста</p>';
    } else {
      this.listElement.replaceChildren(...items);
    }
    this.orderButton.disabled = items.length === 0;
  }

  set total(price: number) {
    this.totalElement.textContent = `${price} синапсов`;
  }
}