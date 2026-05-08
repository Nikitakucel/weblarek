import { IProduct } from '../../types';

export class ProductModel {
  private items: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  setItems(products: IProduct[]): void {
    this.items = products;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getProductById(id: string): IProduct | undefined {
    return this.items.find(p => p.id === id);
  }

  setSelectedProduct(product: IProduct | null): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}