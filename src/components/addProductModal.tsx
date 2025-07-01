'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  createProductThunk,
  fetchProductsThunk,
} from '@/features/product/productThunk';
import type { CreateProductInput } from '@/types/product';
import { uploadImage } from '@/utils/api/uploadImage';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const inputFields = [
  { name: 'name', type: 'text', placeholder: 'Product Name' },
  { name: 'price', type: 'number', placeholder: 'Price' },
  { name: 'initialQuantity', type: 'number', placeholder: 'Initial Quantity' },
  { name: 'category', type: 'text', placeholder: 'Category' },
];

const textareaFields = [{ name: 'description', placeholder: 'Description' }];

export default function AddProductModal({ isOpen, onClose }: Props) {
  const dispatch = useAppDispatch();

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mapped inputs */}
          {inputFields.map(({ name, type, placeholder }) => (
            <input
              key={name}
              type={type}
              name={name}
              placeholder={placeholder}
              value={
                typeof formData[name as keyof typeof formData] === 'number' &&
                formData[name as keyof typeof formData] === 0
                  ? ''
                  : (formData[name as keyof typeof formData] as string | number)
              }
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              required
            />
          ))}

          {/* Mapped textarea */}
          {textareaFields.map(({ name, placeholder }) => (
            <textarea
              key={name}
              name={name}
              placeholder={placeholder}
              value={formData[name as keyof typeof formData] as string}
              onChange={handleChange}
              className="w-full rounded border px-3 py-2"
              rows={3}
              required
            />
          ))}

          {/* Image Upload */}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            required
          />
          {imagePreview && (
            <div className="relative mt-2 h-40 w-full">
              <Image
                src={imagePreview}
                alt="Preview"
                fill
                className="rounded object-cover"
                unoptimized // 👈 allows blob/object URLs to work
              />
            </div>
          )}

          {/* In stock */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            <span>In Stock</span>
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
