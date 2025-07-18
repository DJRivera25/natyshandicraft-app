'use client';

import { useState, useRef } from 'react';
import { Upload, X, Plus, Trash2, Star, Tag } from 'lucide-react';
import { uploadImage } from '@/utils/api/uploadImage';
import { apiCreateProduct } from '@/utils/api/products';
import { useToast } from '@/components/Toast';
import type { CreateProductInput } from '@/types/product';
import Image from 'next/image';

interface Props {
  isOpen: boolean;
  onCloseAction: () => void;
}

// Form field configurations for mapping
const basicFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Product Name',
    placeholder: 'Enter product name',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Description',
    placeholder: 'Describe your product...',
    rows: 2,
  },
  {
    name: 'category',
    type: 'text',
    label: 'Category',
    placeholder: 'e.g., Jewelry, Home Decor, Kitchen',
  },
  {
    name: 'sku',
    type: 'text',
    label: 'SKU (Stock Keeping Unit)',
    placeholder: 'e.g., HW-BOWL-001',
  },
];

const pricingFields = [
  {
    name: 'price',
    type: 'number',
    label: 'Price',
    placeholder: '0.00',
    required: true,
    prefix: '',
  },
  {
    name: 'discountPercent',
    type: 'number',
    label: 'Discount Percentage',
    placeholder: '0',
    min: 0,
    max: 100,
  },
];

const inventoryFields = [
  {
    name: 'stock',
    type: 'number',
    label: 'Stock Quantity',
    placeholder: '0',
    required: true,
  },
  {
    name: 'restockThreshold',
    type: 'number',
    label: 'Restock Threshold',
    placeholder: '5',
  },
];

const dateFields = [
  {
    name: 'availableFrom',
    type: 'date',
    label: 'Available From',
    placeholder: 'Select start date',
  },
  {
    name: 'availableUntil',
    type: 'date',
    label: 'Available Until',
    placeholder: 'Select end date',
  },
];

const checkboxFields = [
  { name: 'discountActive', label: 'Activate discount' },
  { name: 'isFeatured', label: 'Featured product', icon: Star },
  { name: 'isActive', label: 'Product is active' },
];

interface FieldConfig {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required?: boolean;
  prefix?: string;
  min?: number;
  max?: number;
  rows?: number;
}

interface CheckboxFieldConfig {
  name: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export default function AddProductModal({ isOpen, onCloseAction }: Props) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    price: 0,
    description: '',
    category: '',
    imageUrl: '',
    perspectives: [],
    stock: 0,
    soldQuantity: 0,
    restockThreshold: 5,
    isActive: true,
    isFeatured: false,
    visibility: 'public',
    sku: '',
    discountPercent: 0,
    discountActive: false,
    promoText: '',
    tags: [],
    availableFrom: undefined,
    availableUntil: undefined,
    views: 0,
    wishlistCount: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPerspectiveDragOver, setIsPerspectiveDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const perspectiveFileInputRef = useRef<HTMLInputElement>(null);
  const [perspectiveFiles, setPerspectiveFiles] = useState<File[]>([]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    if (type === 'file') {
      const file = files?.[0] || null;
      // Only handle main image file input here
      if (name === 'mainImage' || !name) {
        setImageFile(file);
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setPreviewUrl(reader.result as string);
          reader.readAsDataURL(file);
        } else {
          setPreviewUrl(null);
        }
      }
      // Additional images are handled by handleImageUpload function
    } else if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'availableFrom' || name === 'availableUntil') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: [
          'price',
          'stock',
          'restockThreshold',
          'discountPercent',
        ].includes(name)
          ? parseFloat(value)
          : value,
      }));
    }
  };

  const handleAdditionalImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPerspectiveFiles((prev) => {
        const newFiles = Array.from(files).slice(0, 3 - prev.length);
        return [...prev, ...newFiles].slice(0, 3);
      });
    }
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((t) => t !== tag),
    }));
  };

  const handlePerspectiveRemove = (index: number) => {
    setPerspectiveFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      perspectives: prev.perspectives?.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (file: File) => {
    const imageUrl = await uploadImage(file);
    setFormData((prev) => {
      const currentPerspectives = prev.perspectives || [];
      if (currentPerspectives.length >= 3) return prev;
      if (currentPerspectives.includes(imageUrl)) return prev;
      return {
        ...prev,
        perspectives: [...currentPerspectives, imageUrl],
      };
    });
  };

  const handleDragDrop = (
    e: React.DragEvent,
    setIsDragOverFn: (value: boolean) => void,
    handleUploadFn: (file: File) => void
  ) => {
    e.preventDefault();
    if (e.type === 'dragover') setIsDragOverFn(true);
    if (e.type === 'dragleave') setIsDragOverFn(false);
    if (e.type === 'drop') {
      setIsDragOverFn(false);
      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) => file.type.startsWith('image/'));
      if (imageFile) handleUploadFn(imageFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      // Upload perspective images
      let perspectiveUrls: string[] = [];
      if (perspectiveFiles.length > 0) {
        perspectiveUrls = await Promise.all(perspectiveFiles.map(uploadImage));
      }
      await apiCreateProduct({
        ...formData,
        imageUrl,
        perspectives: perspectiveUrls,
      });
      setFormData({
        name: '',
        price: 0,
        description: '',
        category: '',
        imageUrl: '',
        perspectives: [],
        stock: 0,
        soldQuantity: 0,
        restockThreshold: 5,
        isActive: true,
        isFeatured: false,
        visibility: 'public',
        sku: '',
        discountPercent: 0,
        discountActive: false,
        promoText: '',
        tags: [],
        availableFrom: undefined,
        availableUntil: undefined,
        views: 0,
        wishlistCount: 0,
      });
      setImageFile(null);
      setPreviewUrl(null);
      setTagInput('');
      setPerspectiveFiles([]);
      showToast('success', 'Product created successfully!');
      onCloseAction();
    } catch (error) {
      console.error('Failed to create product:', error);
      showToast('error', 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render input field based on configuration
  const renderField = (field: FieldConfig) => {
    const fieldValue = formData[field.name as keyof CreateProductInput];
    const stringValue =
      fieldValue instanceof Date
        ? fieldValue.toISOString().split('T')[0]
        : String(fieldValue || '');

    const commonProps = {
      name: field.name,
      value: stringValue,
      onChange: handleChange,
      className:
        'w-full px-1.5 sm:px-2 py-1 sm:py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-xs',
      placeholder: field.placeholder,
      required: field.required,
      min: field.min,
      max: field.max,
    };

    if (field.type === 'textarea') {
      return (
        <div className="space-y-0.5">
          <label className="block text-xs font-medium text-gray-700">
            {field.label}{' '}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <textarea
            {...commonProps}
            rows={field.rows}
            className={commonProps.className + ' resize-none'}
          />
        </div>
      );
    }

    if (field.prefix) {
      return (
        <div className="space-y-0.5">
          <label className="block text-xs font-medium text-gray-700">
            {field.label}{' '}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <span className="absolute left-1.5 sm:left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">
              {field.prefix}
            </span>
            <input
              {...commonProps}
              type={field.type}
              className={commonProps.className + ' pl-4 sm:pl-5 pr-2'}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-0.5">
        <label className="block text-xs font-medium text-gray-700">
          {field.label}{' '}
          {field.required && <span className="text-red-500">*</span>}
        </label>
        <input {...commonProps} type={field.type} />
      </div>
    );
  };

  // Render checkbox field
  const renderCheckbox = (field: CheckboxFieldConfig) => (
    <label
      key={field.name}
      className="flex items-center gap-1 cursor-pointer group"
    >
      <input
        type="checkbox"
        name={field.name}
        checked={!!formData[field.name as keyof CreateProductInput]}
        onChange={handleChange}
        className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600 border-gray-300 rounded focus:ring-green-500"
      />
      {field.icon && (
        <field.icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-500" />
      )}
      <span className="text-xs text-gray-700 group-hover:text-gray-900">
        {field.label}
      </span>
    </label>
  );

  const ImageUploadZone = ({
    title,
    isDragOver,
    setIsDragOver,
    onUpload,
    preview,
    onRemove,
    fileRef,
    multiple = false,
    showPreview = true,
    inputName = '',
  }: {
    title: string;
    isDragOver: boolean;
    setIsDragOver: (value: boolean) => void;
    onUpload: (file: File) => void;
    preview?: string | null;
    onRemove?: () => void;
    fileRef: React.RefObject<HTMLInputElement | null>;
    multiple?: boolean;
    showPreview?: boolean;
    inputName?: string;
  }) => {
    const isLimitReached =
      inputName === 'additionalImages' &&
      (formData.perspectives?.length || 0) >= 3;

    return (
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-1">
          <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          {title}
        </h3>
        <div
          className={`border-2 border-dashed rounded-lg p-1.5 sm:p-2 text-center transition-all ${
            isLimitReached
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : isDragOver
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-400'
          }`}
          onDragOver={(e) =>
            !isLimitReached && handleDragDrop(e, setIsDragOver, onUpload)
          }
          onDragLeave={(e) =>
            !isLimitReached && handleDragDrop(e, setIsDragOver, onUpload)
          }
          onDrop={(e) =>
            !isLimitReached && handleDragDrop(e, setIsDragOver, onUpload)
          }
        >
          {isLimitReached ? (
            <div className="space-y-1">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-500">
                Maximum 3 additional images reached
              </p>
            </div>
          ) : preview && showPreview ? (
            <div className="space-y-1">
              <Image
                src={preview}
                alt="Preview"
                width={96}
                height={64}
                className="w-full h-12 sm:h-16 object-contain rounded-lg mx-auto bg-gray-50"
              />
              <button
                type="button"
                onClick={onRemove}
                className="px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200 transition-colors flex items-center gap-1 mx-auto"
              >
                <Trash2 className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> Remove
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Upload className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-auto" />
              <p className="text-xs text-gray-600">
                Drag & drop or click to browse
              </p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-1.5 sm:px-2 py-0.5 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
              >
                Choose File
              </button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            name={inputName}
            accept="image/*"
            multiple={multiple}
            onChange={
              inputName === 'mainImage'
                ? handleChange
                : handleAdditionalImageChange
            }
            className="hidden"
            disabled={isLimitReached}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 border-b border-green-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-green-900 flex items-center gap-1">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                Add New Product
              </h2>
              <p className="text-green-700 text-xs">
                Create a new product listing
              </p>
            </div>
            <button
              onClick={onCloseAction}
              className="p-1 hover:bg-green-100 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-green-700" />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-2 sm:p-3 flex-1 overflow-y-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Left Column */}
            <div className="space-y-2 sm:space-y-3">
              {/* Basic Info */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Basic Information
                </h3>
                <div className="space-y-1 sm:space-y-1.5">
                  {basicFields.map((field, index) => (
                    <div
                      key={field.name}
                      className={
                        index === 1
                          ? ''
                          : index === 2 || index === 3
                            ? 'grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5'
                            : ''
                      }
                    >
                      {index === 2 || index === 3
                        ? renderField(field)
                        : renderField(field)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  Pricing & Discounts
                </h3>
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
                    {pricingFields.map((field) => (
                      <div key={field.name}>{renderField(field)}</div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {checkboxFields
                      .slice(0, 2)
                      .map((field) => renderCheckbox(field))}
                  </div>
                  <div className="space-y-0.5">
                    <label className="block text-xs font-medium text-gray-700">
                      Promotional Text
                    </label>
                    <input
                      type="text"
                      name="promoText"
                      value={formData.promoText}
                      onChange={handleChange}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-xs"
                      placeholder="e.g., Limited time offer! Free shipping"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-1 sm:space-y-1.5">
                <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-blue-500" />
                  Tags
                </h3>
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' &&
                        (e.preventDefault(), handleTagAdd())
                      }
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-xs"
                      placeholder="Add tag and press Enter"
                    />
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-2 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-xs"
                    >
                      <Plus className="w-2.5 h-2.5" /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-2 h-2" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-2 sm:space-y-3">
              {/* Main Image */}
              <ImageUploadZone
                title="Main Product Image"
                isDragOver={isDragOver}
                setIsDragOver={setIsDragOver}
                onUpload={(file: File) => {
                  setImageFile(file);
                  const reader = new FileReader();
                  reader.onloadend = () =>
                    setPreviewUrl(reader.result as string);
                  reader.readAsDataURL(file);
                }}
                preview={previewUrl}
                onRemove={() => {
                  setImageFile(null);
                  setPreviewUrl(null);
                }}
                fileRef={fileInputRef}
                inputName="mainImage"
              />

              {/* Perspective Images */}
              <ImageUploadZone
                title={`Additional Images (${formData.perspectives?.length || 0}/3)`}
                isDragOver={isPerspectiveDragOver}
                setIsDragOver={setIsPerspectiveDragOver}
                onUpload={handleImageUpload}
                fileRef={perspectiveFileInputRef}
                multiple={true}
                showPreview={false}
                inputName="additionalImages"
              />

              {formData.perspectives && formData.perspectives.length > 0 && (
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                  {formData.perspectives.map((p, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={p}
                        alt={`Perspective ${index + 1}`}
                        width={96}
                        height={64}
                        className="w-full h-12 sm:h-16 object-contain rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => handlePerspectiveRemove(index)}
                        className="absolute -top-0.5 -right-0.5 bg-red-500 text-white rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="w-1.5 h-1.5 sm:w-2 sm:h-2" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Inventory & Settings */}
              <div className="space-y-1.5 sm:space-y-2">
                <h3 className="text-xs font-semibold text-gray-900 flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  Inventory & Settings
                </h3>
                <div className="space-y-1 sm:space-y-1.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
                    {inventoryFields.map((field) => (
                      <div key={field.name}>{renderField(field)}</div>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    {renderCheckbox(checkboxFields[2])}
                    <div className="space-y-0.5">
                      <label className="block text-xs font-medium text-gray-700">
                        Visibility
                      </label>
                      <select
                        name="visibility"
                        value={formData.visibility}
                        onChange={handleChange}
                        className="px-1.5 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-xs"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-1.5">
                    {dateFields.map((field) => (
                      <div key={field.name}>{renderField(field)}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200 flex-shrink-0">
            <button
              type="button"
              onClick={onCloseAction}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
