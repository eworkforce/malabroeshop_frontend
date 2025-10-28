import apiClient from './api';

export interface UnitOfMeasure {
  id: number;
  name: string;
  abbreviation: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
  is_active: boolean;
  unit_of_measure?: UnitOfMeasure;
}

class ProductService {
  getProducts(): Promise<Product[]> {
    return apiClient.get('/products/').then(response => response.data);
  }

  getProduct(id: number): Promise<Product> {
    return apiClient.get(`/products/${id}`).then(response => response.data);
  }
}

export default new ProductService();
