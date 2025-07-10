import type { Product } from '@/types/product';

// Normalize product data to ensure consistent structure
export function normalizeProduct(product: Record<string, unknown>): Product {
  return {
    _id: product._id as string,
    name: product.name as string,
    description: (product.description as string) || '',
    price: product.price as number,
    stock: (product.stock as number) || (product.inStock as number) || 0, // Handle both old and new field names
    isActive:
      product.isActive !== undefined
        ? (product.isActive as boolean)
        : (product.inStock as number) !== undefined
          ? (product.inStock as number) > 0
          : true,
    isFeatured: (product.isFeatured as boolean) || false,
    visibility: (product.visibility as 'public' | 'private') || 'public',
    category: (product.category as string) || '',
    imageUrl: (product.imageUrl as string) || '',
    discountActive: (product.discountActive as boolean) || false,
    discountPercent: (product.discountPercent as number) || 0,
    sku: (product.sku as string) || '',
    tags: (product.tags as string[]) || [],
    promoText: (product.promoText as string) || '',
    restockThreshold: (product.restockThreshold as number) || 5,
    soldQuantity: (product.soldQuantity as number) || 0,
    views: (product.views as number) || 0,
    wishlistCount: (product.wishlistCount as number) || 0,
    reviews: (product.reviews as Product['reviews']) || [],
    createdAt: product.createdAt as string,
    deletedAt: product.deletedAt
      ? new Date(product.deletedAt as string)
      : undefined,
  };
}
