import { Card } from './Card';
import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export interface CardPreviewData {
  data: IProduct;
  inBasket: boolean;
}

export class CardPreview extends Card<CardPreviewData> {
  private descriptionElement: HTMLElement;
  private buttonElement: HTMLButtonElement;
  private currentProduct?: IProduct;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.descriptionElement = container.querySelector('.card__text')!;
    this.buttonElement = container.querySelector('.card__button')!;

    this.buttonElement.addEventListener('click', () => {
      if (this.currentProduct) {
        events.emit('product:toggle', this.currentProduct);
      }
    });
  }

  set data(product: IProduct) {
    this.currentProduct = product;
    this.title = product.title;
    this.category = product.category;
    this.image = product.image;
    this.price = product.price;
    this.description = product.description;
    this.updateButton(product, false);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inBasket(value: boolean) {
    if (this.currentProduct) {
      this.updateButton(this.currentProduct, value);
    }
  }

  private updateButton(product: IProduct, inBasket: boolean) {
    if (product.price === null) {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
    } else if (inBasket) {
      this.buttonElement.textContent = 'Удалить из корзины';
      this.buttonElement.disabled = false;
    } else {
      this.buttonElement.textContent = 'Купить';
      this.buttonElement.disabled = false;
    }
  }
}