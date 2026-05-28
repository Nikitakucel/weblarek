import { Card } from './Card';
import { ensureElement } from '../../utils/utils';

interface CardBasketData {
  title: string;
  price: number | null;
  index: number;
}

export class CardBasket extends Card<CardBasketData> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete?: () => void) {
    super(container);
    this.indexElement = ensureElement('.basket__item-index', container);
    this.deleteButton = ensureElement('.basket__item-delete', container) as HTMLButtonElement;
    if (onDelete) {
      this.deleteButton.addEventListener('click', onDelete);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value + 1);
  }
}