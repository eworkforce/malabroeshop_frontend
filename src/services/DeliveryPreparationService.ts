import api from './api'
import type { PreparationSummaryResponse } from '@/types/delivery'

class DeliveryPreparationService {
  /**
   * Get delivery preparation summary for paid orders
   * @param dateFrom Optional start date filter (YYYY-MM-DD)
   * @param dateTo Optional end date filter (YYYY-MM-DD)
   * @returns Promise with preparation summary data
   */
  async getPreparationSummary(
    dateFrom?: string,
    dateTo?: string
  ): Promise<PreparationSummaryResponse> {
    const params: Record<string, string> = {}
    
    if (dateFrom) {
      params.date_from = dateFrom
    }
    
    if (dateTo) {
      params.date_to = dateTo
    }
    
    const response = await api.get('/admin/orders/preparation-summary', { params })
    return response.data
  }
}

export default new DeliveryPreparationService()
