import { Form } from './Form';
import { ensureElement } from '../../utils/utils';

interface ContactsData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<ContactsData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onEmailChange?: (data: { email: string }) => void,
    onPhoneChange?: (data: { phone: string }) => void,
    onSubmit?: () => void
  ) {
    super(container, onSubmit);
    this.emailInput = ensureElement('input[name="email"]', container) as HTMLInputElement;
    this.phoneInput = ensureElement('input[name="phone"]', container) as HTMLInputElement;

    this.emailInput.addEventListener('input', (e) => {
      onEmailChange?.({ email: (e.target as HTMLInputElement).value });
    });
    this.phoneInput.addEventListener('input', (e) => {
      onPhoneChange?.({ phone: (e.target as HTMLInputElement).value });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}