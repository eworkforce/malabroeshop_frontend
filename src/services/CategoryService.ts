import apiClient from './api';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

class CategoryService {
  getCategories(): Promise<Category[]> {
    return apiClient.get('/categories/').then(response => response.data);
  }

  getCategory(id: number): Promise<Category> {
    return apiClient.get(`/categories/${id}`).then(response => response.data);
  }

  createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    return apiClient.post('/categories/', category).then(response => response.data);
  }

  updateCategory(id: number, category: Partial<Omit<Category, 'id'>>): Promise<Category> {
    return apiClient.put(`/categories/${id}`, category).then(response => response.data);
  }

  deleteCategory(id: number): Promise<void> {
    return apiClient.delete(`/categories/${id}`).then(response => response.data);
  }
}

export default new CategoryService();
