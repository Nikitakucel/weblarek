import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Header } from './components/Views/Header';
import { Gallery } from './components/Views/Gallery';
import { Modal } from './components/Views/Modal';
import { CardCatalog } from './components/Views/CardCatalog';
import { CardPreview } from './components/Views/CardPreview';
import { CardBasket } from './components/Views/CardBasket';
import { Basket } from './components/Views/Basket';
import { OrderForm } from './components/Views/OrderForm';
import { ContactsForm } from './components/Views/ContactsForm';
import { Success } from './components/Views/Success';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

// Модели
const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

// Корневые контейнеры
const headerContainer = ensureElement('.header');
const galleryContainer = ensureElement('.gallery');
const modalContainer = ensureElement('#modal-container');

// Отслеживание текущего представления в модальном окне
let currentModalView: 'preview' | 'basket' | 'order' | 'contacts' | 'success' | null = null;

const modal = new Modal(modalContainer, () => {
  currentModalView = null;
});

// Представления
const header = new Header(headerContainer, () => events.emit('basket:open'));
const gallery = new Gallery(galleryContainer);

// Шаблоны
const cardCatalogTpl = '#card-catalog';
const cardPreviewTpl = '#card-preview';
const cardBasketTpl = '#card-basket';
const basketTpl = '#basket';
const orderTpl = '#order';
const contactsTpl = '#contacts';
const successTpl = '#success';

// Экземпляры для модальных окон
const preview = new CardPreview(cloneTemplate(cardPreviewTpl), () => events.emit('product:toggle'));
const basket = new Basket(cloneTemplate(basketTpl), () => events.emit('order:start'));
const orderForm = new OrderForm(
  cloneTemplate(orderTpl),
  (data) => events.emit('order:paymentChange', data),
  (data) => events.emit('order:addressChange', data),
  () => events.emit('order:submit')
);
const contactsForm = new ContactsForm(
  cloneTemplate(contactsTpl),
  (data) => events.emit('contacts:emailChange', data),
  (data) => events.emit('contacts:phoneChange', data),
  () => events.emit('contacts:submit')
);
const success = new Success(cloneTemplate(successTpl), () => events.emit('success:close'));

// --- Подписки на события ---

events.on('catalog:changed', () => {
  const products = productModel.getItems();
  const cards = products.map(product => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTpl), () => events.emit('card:select', { id: product.id }));
    return card.render({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image
    });
  });
  gallery.items = cards;
});

events.on('card:select', (data: { id: string }) => {
  const product = productModel.getProductById(data.id);
  if (product) {
    productModel.setSelectedProduct(product);
  }
});

events.on('product:selected', () => {
  const product = productModel.getSelectedProduct();
  if (!product) return;
  const inBasket = cartModel.hasItem(product.id);
  modal.content = preview.render({
    title: product.title,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description,
    buttonText: product.price === null ? 'Недоступно' : (inBasket ? 'Удалить из корзины' : 'Купить'),
    buttonDisabled: product.price === null
  });
  currentModalView = 'preview';
  modal.open();
});

events.on('product:toggle', () => {
  const product = productModel.getSelectedProduct();
  if (!product) return;
  if (cartModel.hasItem(product.id)) {
    cartModel.removeItem(product.id);
  } else {
    cartModel.addItem(product);
  }
});

events.on('cart:changed', () => {
  header.cartCount = cartModel.getCount();

  if (currentModalView === 'preview') {
    const selected = productModel.getSelectedProduct();
    if (selected) {
      const inBasket = cartModel.hasItem(selected.id);
      preview.buttonText = selected.price === null ? 'Недоступно' : (inBasket ? 'Удалить из корзины' : 'Купить');
      preview.buttonDisabled = selected.price === null;
    }
  }

  const items = cartModel.getItems().map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTpl), () => events.emit('basket:remove', { id: item.id }));
    return card.render({ title: item.title, price: item.price, index });
  });
  basket.items = items;
  basket.total = cartModel.getTotal();
  basket.orderDisabled = cartModel.getCount() === 0;
});

events.on('basket:open', () => {
  modal.content = basket.render();
  currentModalView = 'basket';
  modal.open();
});

events.on('basket:remove', (data: { id: string }) => {
  cartModel.removeItem(data.id);
});

events.on('order:start', () => {
  buyerModel.clear();
  modal.content = orderForm.render();
  currentModalView = 'order';
  modal.open();
});

events.on('order:paymentChange', (data: { method: 'card' | 'cash' }) => {
  buyerModel.setData({ payment: data.method });
});

events.on('order:addressChange', (data: { address: string }) => {
  buyerModel.setData({ address: data.address });
});

events.on('contacts:emailChange', (data: { email: string }) => {
  buyerModel.setData({ email: data.email });
});

events.on('contacts:phoneChange', (data: { phone: string }) => {
  buyerModel.setData({ phone: data.phone });
});

events.on('buyer:changed', () => {
  const data = buyerModel.getData();
  const errors = buyerModel.validate();

  if (currentModalView === 'order') {
    orderForm.payment = data.payment ?? '';
    orderForm.address = data.address;
    const stepErrors = [errors.payment, errors.address].filter(Boolean).join(', ');
    orderForm.errors = stepErrors;
    orderForm.valid = !errors.payment && !errors.address;
  }

  if (currentModalView === 'contacts') {
    contactsForm.email = data.email;
    contactsForm.phone = data.phone;
    const stepErrors = [errors.email, errors.phone].filter(Boolean).join(', ');
    contactsForm.errors = stepErrors;
    contactsForm.valid = !errors.email && !errors.phone;
  }
});

events.on('order:submit', () => {
  modal.content = contactsForm.render();
  currentModalView = 'contacts';
});

events.on('contacts:submit', () => {
  const order = {
    ...buyerModel.getData(),
    total: cartModel.getTotal(),
    items: cartModel.getItems().map(item => item.id)
  };
  larekApi.postOrder(order)
    .then(response => {
      success.total = response.total;
      modal.content = success.render();
      currentModalView = 'success';
      cartModel.clear();
      buyerModel.clear();
    })
    .catch(err => console.error('Ошибка заказа:', err));
});

events.on('success:close', () => {
  modal.close();
});

// Загрузка каталога
larekApi.getProducts()
  .then(response => productModel.setItems(response.items))
  .catch(err => console.error('Ошибка загрузки каталога:', err));