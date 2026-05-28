import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface OrderData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<OrderData> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container);
    this.cardButton = ensureElement('button[name="card"]', this.container) as HTMLButtonElement;
    this.cashButton = ensureElement('button[name="cash"]', this.container) as HTMLButtonElement;
    this.addressInput = ensureElement('input[name="address"]', this.container) as HTMLInputElement;

    this.cardButton.addEventListener('click', () => this.setPayment('card', events));
    this.cashButton.addEventListener('click', () => this.setPayment('cash', events));
    this.addressInput.addEventListener('input', () => this.emitChanges(events));

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit('order:submit');
    });
  }

  private setPayment(method: 'card' | 'cash', events: EventEmitter) {
    this.cardButton.classList.toggle('button_alt-active', method === 'card');
    this.cashButton.classList.toggle('button_alt-active', method === 'cash');
    this.emitChanges(events);
  }

  getInputData(): OrderData {
    return {
      payment: this.cardButton.classList.contains('button_alt-active') ? 'card' : 'cash',
      address: this.addressInput.value,
    };
  }

  private emitChanges(events: EventEmitter) {
    events.emit('order:change', this.getInputData());
  }

  set payment(value: string) {
    if (value === 'card') {
      this.cardButton.classList.add('button_alt-active');
      this.cashButton.classList.remove('button_alt-active');
    } else {
      this.cashButton.classList.add('button_alt-active');
      this.cardButton.classList.remove('button_alt-active');
    }
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}