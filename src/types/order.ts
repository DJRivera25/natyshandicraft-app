export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Address {
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface Location {
  lat: number;
  lng: number;
  formattedAddress?: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  status: 'pending' | 'paid' | 'cancelled';
  totalAmount: number;
  paymentMethod?: string;
  paidAt?: string;
  address: Address;
  location?: Location;
  createdAt: string;
  updatedAt: string;
}

// For creating an order (client to backend)
export type CreateOrderInput = Omit<Order, '_id' | 'createdAt' | 'updatedAt'>;

// For updating an order (PATCH/PUT)
export type UpdateOrderInput = Partial<CreateOrderInput>;
