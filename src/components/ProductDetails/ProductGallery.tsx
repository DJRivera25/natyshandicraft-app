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
  const perspectives = product.perspectives?.slice(0, 3) || []; // Keep 3 perspectives limit
  const galleryImages = [product.imageUrl, ...perspectives].filter(
    Boolean
  ) as string[];
  const currentImage = galleryImages[selectedImageIndex] || '/placeholder.jpg';

  return (
    <div className="w-full h-full">
      {/* Main Image */}
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] mb-3 sm:mb-4">
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={currentImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain rounded-xl bg-gradient-to-br from-amber-50 to-white shadow-lg"
            style={{ background: '#f7f7f7' }}
          />
        </div>
      </div>

      {/* Horizontal Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex flex-row gap-2 sm:gap-3 items-center justify-center">
          {galleryImages.slice(0, 4).map((img, idx) => (
            <button
              key={img + idx}
              onClick={() => onImageSelect(idx)}
              className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                idx === selectedImageIndex
                  ? 'border-amber-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-amber-300 hover:scale-105'
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
    </div>
  );
};

export default ProductGallery;
