import { Card } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface CardPreviewData {
  title: string;
  price: number | null;
  category: string;
  image: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<CardPreviewData> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;
  private descriptionElement: HTMLElement;
  private buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, onButtonClick?: () => void) {
    super(container);
    this.categoryElement = ensureElement('.card__category', container);
    this.imageElement = ensureElement('.card__image', container) as HTMLImageElement;
    this.descriptionElement = ensureElement('.card__text', container);
    this.buttonElement = ensureElement('.card__button', container) as HTMLButtonElement;
    if (onButtonClick) {
      this.buttonElement.addEventListener('click', onButtonClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category card__category_${categoryMap[value] || 'other'}`;
  }

  set image(src: string) {
    this.imageElement.src = `${CDN_URL}/${src}`;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}