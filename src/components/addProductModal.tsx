'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  createProductThunk,
  fetchProductsThunk,
} from '@/features/product/productThunk';
import type { CreateProductInput } from '@/types/product';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, value, type, checked, files } = target;

      if (type === 'file') {
        setImageFile(files?.[0] ?? null);
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
    } else {
      // For textarea (HTMLTextAreaElement)
      const { name, value } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = '';
    if (imageFile) {
      // In a real app, you'd upload the file to a server or Cloudinary, etc.
      // For now, just convert to a temporary object URL:
      imageUrl = URL.createObjectURL(imageFile);
    }

    await dispatch(createProductThunk({ ...formData, imageUrl }));
    await dispatch(fetchProductsThunk());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price === 0 ? '' : formData.price}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />

          <input
            type="number"
            name="initialQuantity"
            placeholder="Initial Quantity"
            value={
              formData.initialQuantity === 0 ? '' : formData.initialQuantity
            }
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            rows={3}
            required
          />

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
            required
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            <span>In Stock</span>
          </label>

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
