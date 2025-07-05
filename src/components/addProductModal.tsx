'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createProductThunk,
  fetchProductsThunk,
} from '@/features/product/productThunk';
import { uploadImage } from '@/utils/api/uploadImage';
import type { CreateProductInput } from '@/types/product';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.category);

  const [formData, setFormData] = useState<
    Omit<CreateProductInput, 'imageUrl'>
  >({
    name: '',
    price: 0,
    description: '',
    category: '',
    initialQuantity: 0,
    inStock: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;

    if (type === 'file') {
      const file = files?.[0] ?? null;
      setImageFile(file);
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === 'checkbox'
            ? checked
            : name === 'price' || name === 'initialQuantity'
              ? parseFloat(value)
              : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await dispatch(createProductThunk({ ...formData, imageUrl }));
      await dispatch(fetchProductsThunk());
      onClose();
    } catch (err) {
      console.error('❌ Failed to add product:', err);
      alert((err as Error).message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-semibold text-amber-800">
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 focus:outline-amber-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 text-sm font-medium">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 focus:outline-amber-500"
              required
            />
          </div>

          {/* Initial Quantity */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Initial Quantity *
            </label>
            <input
              type="number"
              name="initialQuantity"
              value={formData.initialQuantity || ''}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2 focus:outline-amber-500"
              required
            />
          </div>

          {/* Category dropdown + free input */}
          <div>
            <label className="block mb-1 text-sm font-medium">Category *</label>
            <input
              list="category-options"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Choose or enter category"
              className="w-full rounded border px-3 py-2 focus:outline-amber-500"
              required
            />
            <datalist id="category-options">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded border px-3 py-2 focus:outline-amber-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Product Image *
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm"
              required
            />
            {imagePreview && (
              <div className="relative mt-2 h-40 w-full rounded overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* In Stock Checkbox */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            <span className="text-sm">In Stock</span>
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2 text-sm hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
