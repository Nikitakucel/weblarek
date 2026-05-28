import { Form } from './Form';
import { ensureElement } from '../../utils/utils';

interface OrderData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<OrderData> {
  private cardButton: HTMLButtonElement;
  private cashButton: HTMLButtonElement;
  private addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onPaymentChange?: (data: { method: 'card' | 'cash' }) => void,
    onAddressChange?: (data: { address: string }) => void,
    onSubmit?: () => void
  ) {
    super(container, onSubmit);
    this.cardButton = ensureElement('button[name="card"]', container) as HTMLButtonElement;
    this.cashButton = ensureElement('button[name="cash"]', container) as HTMLButtonElement;
    this.addressInput = ensureElement('input[name="address"]', container) as HTMLInputElement;

    this.cardButton.addEventListener('click', () => onPaymentChange?.({ method: 'card' }));
    this.cashButton.addEventListener('click', () => onPaymentChange?.({ method: 'cash' }));
    this.addressInput.addEventListener('input', (e) => {
      onAddressChange?.({ address: (e.target as HTMLInputElement).value });
    });
  }

  set payment(value: string) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}