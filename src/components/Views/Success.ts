import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface SuccessData {
  total: number;
}

export class Success extends Component<SuccessData> {
  private totalElement: HTMLElement;

  constructor(container: HTMLElement, onClose?: () => void) {
    super(container);
    this.totalElement = ensureElement('.order-success__description', container);
    const closeButton = ensureElement('.order-success__close', container);
    closeButton.addEventListener('click', () => onClose?.());
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}