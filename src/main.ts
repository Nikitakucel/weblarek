import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { API_URL } from './utils/constants';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { Page } from './components/Views/Page';
import { Modal } from './components/Views/Modal';
import { CardCatalog } from './components/Views/CardCatalog';
import { CardPreview } from './components/Views/CardPreview';
import { CardBasket } from './components/Views/CardBasket';
import { Basket } from './components/Views/Basket';
import { OrderForm } from './components/Views/OrderForm';
import { ContactsForm } from './components/Views/ContactsForm';
import { Success } from './components/Views/Success';
import { IProduct } from './types';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const api = new Api(API_URL);
const larekApi = new LarekApi(api);

const productModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const page = new Page(document.querySelector('.page')!, events);
const modal = new Modal(document.querySelector('#modal-container')!);

let currentBasket: Basket | null = null;
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

// --- Подписки на события ---

events.on('catalog:changed', (products: IProduct[]) => {
  const cards = products.map(p => {
    // используем cloneTemplate – он возвращает HTMLElement
    const container = cloneTemplate<HTMLElement>('#card-catalog');
    const card = new CardCatalog(container, events);
    return card.render({ data: p });
  });
  page.catalog = cards;
});

events.on('card:select', (product: IProduct) => {
  productModel.setSelectedProduct(product);
  const container = cloneTemplate<HTMLElement>('#card-preview');
  const preview = new CardPreview(container, events);
  modal.content = preview.render({
    data: product,
    inBasket: cartModel.hasItem(product.id)
  });
  modal.open();
});

events.on('product:toggle', (product: IProduct) => {
  if (cartModel.hasItem(product.id)) {
    cartModel.removeItem(product.id);
  } else {
    cartModel.addItem(product);
  }
  modal.close();
});

events.on('cart:changed', () => {
  page.cartCount = cartModel.getCount();
  if (currentBasket) {
    const items = cartModel.getItems().map((item, index) => {
      const container = cloneTemplate<HTMLElement>('#card-basket');
      const card = new CardBasket(container, events, item);
      return card.render({ data: item, index });
    });
    currentBasket.items = items;
    currentBasket.total = cartModel.getTotal();
  }
});

events.on('basket:open', () => {
  const container = cloneTemplate<HTMLElement>('#basket');
  const basket = new Basket(container, events);
  currentBasket = basket;

  const items = cartModel.getItems().map((item, index) => {
    const cardContainer = cloneTemplate<HTMLElement>('#card-basket');
    const card = new CardBasket(cardContainer, events, item);
    return card.render({ data: item, index });
  });
  basket.items = items;
  basket.total = cartModel.getTotal();
  modal.content = basket.render();
  modal.open();
});

events.on('basket:remove', (product: IProduct) => {
  cartModel.removeItem(product.id);
});

events.on('order:start', () => {
  buyerModel.clear();
  const container = cloneTemplate<HTMLFormElement>('#order');
  const orderForm = new OrderForm(container, events);
  currentOrderForm = orderForm;
  modal.content = orderForm.render();
  orderForm.valid = false;
  orderForm.errors = '';
});

events.on('order:change', (data: { payment: string; address: string }) => {
  buyerModel.setData(data as any);
  const errors = buyerModel.validate();
  if (currentOrderForm) {
    const stepErrors = [errors.payment, errors.address].filter(Boolean).join(', ');
    currentOrderForm.errors = stepErrors;
    currentOrderForm.valid = !errors.payment && !errors.address;
  }
});

events.on('order:submit', () => {
  const errors = buyerModel.validate();
  if (!errors.payment && !errors.address) {
    const container = cloneTemplate<HTMLFormElement>('#contacts');
    const contactsForm = new ContactsForm(container, events);
    currentContactsForm = contactsForm;
    const data = buyerModel.getData();
    modal.content = contactsForm.render({ email: data.email, phone: data.phone });
    const errs = buyerModel.validate();
    contactsForm.errors = [errs.email, errs.phone].filter(Boolean).join(', ');
    contactsForm.valid = !errs.email && !errs.phone;
  }
});

events.on('contacts:change', (data: { email: string; phone: string }) => {
  buyerModel.setData(data as any);
  const errors = buyerModel.validate();
  if (currentContactsForm) {
    const stepErrors = [errors.email, errors.phone].filter(Boolean).join(', ');
    currentContactsForm.errors = stepErrors;
    currentContactsForm.valid = !errors.email && !errors.phone;
  }
});

events.on('contacts:submit', () => {
  const errors = buyerModel.validate();
  if (!errors.email && !errors.phone) {
    const order = {
      ...buyerModel.getData(),
      total: cartModel.getTotal(),
      items: cartModel.getItems().map(i => i.id)
    };
    larekApi.postOrder(order)
      .then(response => {
        const container = cloneTemplate<HTMLElement>('#success');
        const success = new Success(container, events);
        modal.content = success.render({ total: response.total });
        cartModel.clear();
        buyerModel.clear();
        currentOrderForm = null;
        currentContactsForm = null;
      })
      .catch(err => console.error('Ошибка заказа:', err));
  }
});

events.on('success:close', () => {
  modal.close();
});

// Загрузка каталога
larekApi.getProducts()
  .then(response => productModel.setItems(response.items))
  .catch(err => console.error('Ошибка загрузки каталога:', err));