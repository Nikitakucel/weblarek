import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface BasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<BasketData> {
  private listElement: HTMLElement;
  private totalElement: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, onOrderClick?: () => void) {
    super(container);
    this.listElement = ensureElement('.basket__list', container);
    this.totalElement = ensureElement('.basket__price', container);
    this.orderButton = ensureElement('.basket__button', container) as HTMLButtonElement;
    if (onOrderClick) {
      this.orderButton.addEventListener('click', onOrderClick);
    }
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(price: number) {
    this.totalElement.textContent = `${price} синапсов`;
  }

  set orderDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}