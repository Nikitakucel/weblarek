import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface PageData {
  catalog: HTMLElement[];
  cartCount: number;
}

export class Page extends Component<PageData> {
  private catalogElement: HTMLElement;
  private cartCountElement: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.catalogElement = ensureElement('.gallery', this.container);
    this.cartCountElement = ensureElement('.header__basket-counter', this.container);

    const cartButton = ensureElement('.header__basket', this.container);
    cartButton.addEventListener('click', () => events.emit('basket:open'));
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }

  set cartCount(count: number) {
    this.cartCountElement.textContent = String(count);
  }
}