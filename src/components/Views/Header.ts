import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface HeaderData {
  cartCount: number;
}

export class Header extends Component<HeaderData> {
  private cartCountElement: HTMLElement;

  constructor(container: HTMLElement, onCartClick?: () => void) {
    super(container);
    this.cartCountElement = ensureElement('.header__basket-counter', container);
    const cartButton = ensureElement('.header__basket', container);
    cartButton.addEventListener('click', () => onCartClick?.());
  }

  set cartCount(count: number) {
    this.cartCountElement.textContent = String(count);
  }
}