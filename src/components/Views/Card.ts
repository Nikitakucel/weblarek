import { Component } from '../base/Component';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

export abstract class Card<T = {}> extends Component<T> {
  protected titleElement: HTMLElement;
  protected categoryElement?: HTMLElement;
  protected imageElement?: HTMLImageElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.titleElement = ensureElement('.card__title', this.container);
    this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
    this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
    this.priceElement = ensureElement('.card__price', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      this.categoryElement.className = `card__category card__category_${categoryMap[value] || 'other'}`;
    }
  }

  set price(value: number | null) {
    this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
  }

  set image(src: string) {
    if (this.imageElement) {
      this.imageElement.src = `${CDN_URL}/${src}`;
    }
  }
}