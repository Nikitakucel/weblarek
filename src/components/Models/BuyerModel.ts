import { IBuyer, BuyerValidationErrors } from '../../types';

export class BuyerModel {
  private data: IBuyer = {
    payment: null,
    email: '',
    phone: '',
    address: '',
  };

  setData(partial: Partial<IBuyer>): void {
    this.data = { ...this.data, ...partial };
  }

  getData(): IBuyer {
    return { ...this.data };
  }

  clear(): void {
    this.data = {
      payment: null,
      email: '',
      phone: '',
      address: '',
    };
  }

  validate(): BuyerValidationErrors {
    const errors: BuyerValidationErrors = {};
    if (!this.data.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.data.address.trim()) errors.address = 'Введите адрес доставки';
    if (!this.data.email.trim()) errors.email = 'Укажите email';
    if (!this.data.phone.trim()) errors.phone = 'Укажите телефон';
    return errors;
  }
}