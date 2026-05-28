import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface SuccessData {
  total: number;
}

export class Success extends Component<SuccessData> {
  private totalElement: HTMLElement;

  constructor(container: HTMLElement, events: EventEmitter) {
    super(container);
    this.totalElement = ensureElement('.order-success__description', this.container);
    const closeButton = ensureElement('.order-success__close', this.container);
    closeButton.addEventListener('click', () => events.emit('success:close'));
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value} синапсов`;
  }
}