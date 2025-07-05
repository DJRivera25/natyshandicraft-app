'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { addToCartThunk } from '@/features/cart/cartThunk';
import QuantitySelector from './QuantitySelector';

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
    <div className="flex flex-col md:flex-row items-center gap-4">
      {/* Quantity Adjuster */}
      <QuantitySelector quantity={quantity} setQuantity={setQuantity} />

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-amber-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition-all hover:bg-amber-700 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
        aria-label={`Add ${quantity} ${product.name} to cart`}
      >
        Add to Cart
      </button>
    </div>
  );
}
