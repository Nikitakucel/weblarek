import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { EventEmitter } from '../base/Events';

export interface ContactsData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<ContactsData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: EventEmitter) {
    super(container);
    this.emailInput = ensureElement('input[name="email"]', this.container) as HTMLInputElement;
    this.phoneInput = ensureElement('input[name="phone"]', this.container) as HTMLInputElement;

    this.emailInput.addEventListener('input', () => this.emitChanges(events));
    this.phoneInput.addEventListener('input', () => this.emitChanges(events));

    this.container.addEventListener('submit', (e) => {
      e.preventDefault();
      events.emit('contacts:submit');
    });
  }

  getInputData(): ContactsData {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }

  private emitChanges(events: EventEmitter) {
    events.emit('contacts:change', this.getInputData());
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}