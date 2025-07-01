export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  _id: string;
  user: string; // refers to the User._id
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export type CreateCartInput = Omit<Cart, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateCartInput = Partial<CreateCartInput>;
