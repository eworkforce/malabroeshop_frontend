import apiClient from './api';

export interface UnitOfMeasure {
  id: number;
  name: string;
  abbreviation: string | null;
}

class UnitOfMeasureService {
  getUnitsOfMeasure(): Promise<UnitOfMeasure[]> {
    return apiClient.get('/units-of-measure/').then(response => response.data);
  }

  getUnitOfMeasure(id: number): Promise<UnitOfMeasure> {
    return apiClient.get(`/units-of-measure/${id}`).then(response => response.data);
  }

  createUnitOfMeasure(unit: Omit<UnitOfMeasure, 'id'>): Promise<UnitOfMeasure> {
    return apiClient.post('/units-of-measure/', unit).then(response => response.data);
  }

  updateUnitOfMeasure(id: number, unit: Partial<Omit<UnitOfMeasure, 'id'>>): Promise<UnitOfMeasure> {
    return apiClient.put(`/units-of-measure/${id}`, unit).then(response => response.data);
  }

  deleteUnitOfMeasure(id: number): Promise<void> {
    return apiClient.delete(`/units-of-measure/${id}`).then(response => response.data);
  }
}

export default new UnitOfMeasureService();
