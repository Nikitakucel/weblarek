import { Card } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';
import { ensureElement } from '../../utils/utils';

interface CardCatalogData {
  title: string;
  price: number | null;
  category: string;
  image: string;
}

export class CardCatalog extends Card<CardCatalogData> {
  private categoryElement: HTMLElement;
  private imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onClick?: () => void) {
    super(container);
    this.categoryElement = ensureElement('.card__category', container);
    this.imageElement = ensureElement('.card__image', container) as HTMLImageElement;
    if (onClick) {
      container.addEventListener('click', onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category card__category_${categoryMap[value] || 'other'}`;
  }

  set image(src: string) {
    this.imageElement.src = `${CDN_URL}/${src}`;
  }
}