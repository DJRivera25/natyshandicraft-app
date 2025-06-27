export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'cancelled';
  totalAmount: number;
  paymentMethod?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateOrderInput = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateOrderInput = Partial<CreateOrderInput>;
