import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);
    this.submitButton = ensureElement('.button[type="submit"]', this.container) as HTMLButtonElement;
    this.errorsElement = ensureElement('.form__errors', this.container);
  }

  abstract getInputData(): T;

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(messages: string) {
    this.errorsElement.textContent = messages;
  }
}