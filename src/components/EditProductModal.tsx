'use client';

import { useState, useEffect } from 'react';
import type { UpdateProductInput, Product } from '@/types/product';

interface Props {
  product: Product;
  onClose: () => void;
  onSave: (updated: UpdateProductInput & { imageFile?: File | null }) => void;
}

export default function EditProductModal({ product, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<UpdateProductInput>({
    name: '',
    price: 0,
    description: '',
    category: '',
    imageUrl: '',
    initialQuantity: 0,
    inStock: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description || '',
        category: product.category || '',
        imageUrl: product.imageUrl || '',
        initialQuantity: product.initialQuantity,
        inStock: product.inStock,
      });
      setPreviewUrl(product.imageUrl || null);
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, value, type, checked, files } = target;

      if (type === 'file') {
        const file = files?.[0] || null;
        setImageFile(file);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setPreviewUrl(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(product.imageUrl || null);
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
    } else if (target instanceof HTMLTextAreaElement) {
      const { name, value } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, imageFile });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
            placeholder="Product Name"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
            placeholder="Price"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Description"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
            placeholder="Category"
          />

          {/* 🔽 IMAGE PREVIEW */}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="h-48 w-full rounded object-contain"
            />
          )}
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleChange}
            className="w-full rounded border px-3 py-2"
          />

          <input
            type="number"
            name="initialQuantity"
            value={formData.initialQuantity}
            onChange={handleChange}
            required
            className="w-full rounded border px-3 py-2"
            placeholder="Initial Quantity"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleChange}
            />
            In Stock
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
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
