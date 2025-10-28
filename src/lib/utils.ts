import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Product, UnitOfMeasure } from '@/services/ProductService'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type for items that can be formatted with price and unit
type PriceableItem = {
  price: number;
  unit_of_measure?: UnitOfMeasure;
}

/**
 * Format product price with unit of measure
 * @param item - Product or cart item with price and unit_of_measure
 * @returns Formatted price string (e.g., "1000 F CFA / Kg")
 */
export function formatPriceWithUnit(item: PriceableItem): string {
  // Handle missing item
  if (!item) return "Prix non disponible";
  
  // Handle missing price
  if (typeof item.price !== 'number') return "Prix non disponible";
  
  // Format price (remove decimals for CFA)
  const price = Math.floor(item.price);
  
  // Get unit (prefer abbreviation, fallback to name)
  let unit = "";
  if (item.unit_of_measure) {
    unit = item.unit_of_measure.abbreviation?.trim() || 
           item.unit_of_measure.name?.trim() || 
           "";
  }
  
  // Return formatted string
  return unit ? `${price} F CFA / ${unit}` : `${price} F CFA`;
}
