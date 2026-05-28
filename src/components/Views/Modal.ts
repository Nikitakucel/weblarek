import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ModalData {
  content: HTMLElement | DocumentFragment;
}

export class Modal extends Component<ModalData> {
  private closeButton: HTMLButtonElement;
  private contentElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;
    this.contentElement = ensureElement('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => this.close());
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) this.close();
    });
  }

  set content(node: HTMLElement | DocumentFragment) {
    this.contentElement.replaceChildren(node);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }
}