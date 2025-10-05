// Delivery Preparation Types

export interface OrderItemSummary {
  order_id: number
  order_reference: string
  customer_name: string
  quantity: number
  created_at: string
}

export interface ProductPreparationSummary {
  product_id: number
  product_name: string
  total_quantity: number
  unit: string | null
  order_count: number
  unique_customers: number
  orders: OrderItemSummary[]
}

export interface PreparationSummary {
  total_paid_orders: number
  total_unique_products: number
  total_revenue: number
  last_updated: string
}

export interface PreparationSummaryResponse {
  summary: PreparationSummary
  products: ProductPreparationSummary[]
  date_range: {
    date_from: string | null
    date_to: string | null
  }
}
