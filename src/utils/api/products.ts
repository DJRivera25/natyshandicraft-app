import axiosInstance from '@/utils/axios';
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from '@/types/product';

export const apiFetchProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const res = await axiosInstance.get('/products', {
    params: { page, limit },
  });
  // All product fields are now available in res.data.products
  return res.data;
};

// New function for admin to fetch ALL products (including inactive)
export const apiFetchAllProducts = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const res = await axiosInstance.get('/products/all', {
    params: { page, limit },
  });
  return res.data;
};

export const apiFetchProductById = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get(`/products/${id}`);
  // All product fields are now available in res.data
  return res.data;
};

export const apiDeleteProduct = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};

// Toggle product active status (was previously stock)
export const apiToggleProductActive = async (
  id: string
): Promise<{ message: string }> => {
  const res = await axiosInstance.patch(
    `/products/${id}/toggle?field=isActive`
  );
  return res.data;
};

export const apiCreateProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  // All fields in CreateProductInput are now supported
  const res = await axiosInstance.post('/products', productData);
  return res.data;
};

export const apiUpdateProduct = async (
  id: string,
  productData: UpdateProductInput
): Promise<Product> => {
  // All fields in UpdateProductInput are now supported
  const res = await axiosInstance.put(`/products/${id}`, productData);
  return res.data;
};

export interface SearchProductsParams {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  isFeatured?: boolean;
  discountActive?: boolean;
  inStock?: boolean;
}

export async function apiSearchProducts(params: SearchProductsParams): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const res = await axiosInstance.get('/products/search', {
    params: {
      ...params,
    },
  });
  // All product fields are now available in res.data.products
  return res.data;
}

export const apiCheckPurchaseVerification = async (
  productId: string
): Promise<{ hasPurchased: boolean }> => {
  try {
    const response = await fetch(
      `/api/products/${productId}/purchase-verification`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to check purchase verification');
    }

    const data = await response.json();
    return { hasPurchased: data.hasPurchased || false };
  } catch (error) {
    console.error('Error checking purchase verification:', error);
    return { hasPurchased: false };
  }
};

// Increment product views
export const apiIncrementProductViews = async (
  productId: string
): Promise<{ message: string; views: number }> => {
  const res = await axiosInstance.post(`/products/${productId}/views`);
  return res.data;
};

// Toggle product wishlist status
export const apiToggleWishlist = async (
  productId: string,
  action: 'add' | 'remove'
): Promise<{
  message: string;
  isWishlisted: boolean;
  wishlistCount: number;
}> => {
  const res = await axiosInstance.post(`/products/${productId}/wishlist`, {
    action,
  });
  return res.data;
};

// Check if product is in user's wishlist
export const apiCheckWishlistStatus = async (
  productId: string
): Promise<{ isWishlisted: boolean }> => {
  const res = await axiosInstance.get(`/products/${productId}/wishlist`);
  return res.data;
};

// Update product sold quantity
export const apiUpdateSoldQuantity = async (
  productId: string,
  quantity: number
): Promise<{
  message: string;
  soldQuantity: number;
  stock: number;
}> => {
  const res = await axiosInstance.patch(
    `/products/${productId}/sold-quantity`,
    {
      quantity,
    }
  );
  return res.data;
};
