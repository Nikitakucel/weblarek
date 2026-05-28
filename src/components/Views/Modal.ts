import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ModalData {
  content: HTMLElement | DocumentFragment;
}

export class Modal extends Component<ModalData> {
  private closeButton: HTMLButtonElement;
  private contentElement: HTMLElement;

  constructor(container: HTMLElement, onClose?: () => void) {
    super(container);
    this.closeButton = ensureElement('.modal__close', container) as HTMLButtonElement;
    this.contentElement = ensureElement('.modal__content', container);

    const close = () => {
      this.close();
      onClose?.();
    };

    this.closeButton.addEventListener('click', close);
    container.addEventListener('click', (e) => {
      if (e.target === container) close();
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