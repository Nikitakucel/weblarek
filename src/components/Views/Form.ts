import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, onSubmit?: () => void) {
    super(container);
    this.submitButton = ensureElement('.button[type="submit"]', container) as HTMLButtonElement;
    this.errorsElement = ensureElement('.form__errors', container);
    if (onSubmit) {
      container.addEventListener('submit', (e) => {
        e.preventDefault();
        onSubmit();
      });
    }
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(messages: string) {
    this.errorsElement.textContent = messages;
  }
}