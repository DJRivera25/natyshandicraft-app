export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl?: string;
  initialQuantity: number;
  createdBy?: string;
  inStock?: boolean;
}

export type CreateProductInput = Omit<Product, '_id' | 'createdBy'>;
export type UpdateProductInput = Partial<CreateProductInput>;
