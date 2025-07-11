'use client';

import React from 'react';
import type { Product } from '@/types/product';

interface ProductGalleryProps {
  product: Product;
  selectedImageIndex: number;
  onImageSelect: (index: number) => void;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  selectedImageIndex,
  onImageSelect,
}) => {
  const perspectives = product.perspectives?.slice(0, 3) || [];
  const galleryImages = [product.imageUrl, ...perspectives].filter(
    Boolean
  ) as string[];
  const currentImage = galleryImages[selectedImageIndex] || '/placeholder.jpg';

  return (
    <div className="flex flex-row gap-4 lg:gap-8 min-w-0 w-full lg:w-1/2">
      {/* Vertical Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex flex-col gap-3 items-center justify-center">
          {galleryImages.slice(0, 3).map((img, idx) => (
            <button
              key={img + idx}
              onClick={() => onImageSelect(idx)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                idx === selectedImageIndex
                  ? 'border-amber-500 shadow-lg'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <img
                src={img}
                alt={product.name + ' thumbnail'}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center min-w-[320px] min-h-[320px]">
        <img
          src={currentImage}
          alt={product.name}
          className="object-contain w-full h-[400px] max-w-[500px] rounded-xl bg-gradient-to-br from-amber-50 to-white"
          style={{ background: '#f7f7f7' }}
        />
      </div>
    </div>
  );
};

export default ProductGallery;
