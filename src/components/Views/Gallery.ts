import { Component } from '../base/Component';

interface GalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
  // Конструктор не ищет .gallery внутри контейнера, так как контейнер и есть галерея
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}