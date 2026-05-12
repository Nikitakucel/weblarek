import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { LarekApi } from './components/LarekApi';
import { ProductModel } from './components/Models/ProductModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';
import { IProduct } from './types';

const productModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

console.log('=== ТЕСТИРОВАНИЕ МОДЕЛЕЙ НА ТЕСТОВЫХ ДАННЫХ ===');

// Product
productModel.setItems(apiProducts.items);
console.log('ProductModel: каталог товаров', productModel.getItems());
const sampleProduct = productModel.getItems()[0];
console.log('Поиск по id', productModel.getProductById(sampleProduct.id));
productModel.setSelectedProduct(sampleProduct);
console.log('Выбранный товар', productModel.getSelectedProduct());

// Cart
cartModel.addItem(sampleProduct);
console.log('CartModel: корзина после добавления', cartModel.getItems());
console.log('Количество', cartModel.getCount(), 'Итого', cartModel.getTotal());
const secondProduct = productModel.getItems()[1];
cartModel.addItem(secondProduct);
console.log('После добавления второго', cartModel.getItems(), 'Итого', cartModel.getTotal());
cartModel.removeItem(sampleProduct.id);
console.log('После удаления первого', cartModel.getItems());
cartModel.clear();
console.log('Очистка корзины', cartModel.getItems());

// Buyer
buyerModel.setData({ payment: 'cash', address: 'пр-т Ленина, д.1' });
console.log('BuyerModel: частичные данные', buyerModel.getData());
console.log('Ошибки валидации (ожидаем ошибки email и phone)', buyerModel.validate());
buyerModel.setData({ email: 'test@example.com', phone: '+7 (999) 123-45-67' });
console.log('Полные данные', buyerModel.getData());
console.log('Валидация после заполнения всех полей', buyerModel.validate());
console.log('Всё валидно?', buyerModel.isValid());
buyerModel.clear();
console.log('После очистки', buyerModel.getData());

console.log('\n=== ЗАПРОС К СЕРВЕРУ ===');
const api = new LarekApi();
api.getProducts()
  .then(response => {
    productModel.setItems(response.items);
    console.log('Товары, полученные с сервера, сохранены в модель каталога:');
    console.log(productModel.getItems());
  })
  .catch(err => {
    console.error('Ошибка при загрузке товаров:', err);
  });
