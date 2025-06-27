'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addToCartThunk } from '@/features/cart/cartThunk';

interface Props {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function AddToCartClient({ product }: Props) {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (quantity < 1) return;

    dispatch(
      addToCartThunk({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
        quantity,
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity:
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="w-20 rounded border px-2 py-1 text-center"
        />
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full rounded bg-violet-600 py-2 text-white transition hover:bg-violet-700"
      >
        Add to Cart
      </button>
    </div>
  );
}
