export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  discountPercent?: number;
  discountActive?: boolean;
  category?: string;
  imageUrl?: string;
  perspectives?: string[];
  stock: number;
  soldQuantity: number;
  restockThreshold: number;
  lastRestockedAt?: Date;
  sku?: string;
  isActive: boolean;
  views: number;
  wishlistCount: number;
  tags?: string[];
  isFeatured: boolean;
  promoText?: string;
  availableFrom?: Date;
  availableUntil?: Date;
  visibility: 'public' | 'private';
  deletedAt?: Date;
  reviews: Review[];
  createdBy?: string;
  createdAt?: string;
}

export interface Review {
  user: string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export type CreateProductInput = Omit<
  Product,
  '_id' | 'createdBy' | 'reviews'
> & {
  reviews?: Review[];
};
export type UpdateProductInput = Partial<CreateProductInput>;
