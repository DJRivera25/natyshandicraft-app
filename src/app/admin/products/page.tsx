'use client';

import { useEffect, useState, useCallback } from 'react';
import AdminButton from '@/components/AdminButton';
import AdminLoading from '@/components/AdminLoading';
import AdminError from '@/components/AdminError';
import AddProductModal from '@/components/addProductModal';
import EditProductModal from '@/components/EditProductModal';
import { useToast } from '@/components/Toast';
import {
  apiToggleProductActive,
  apiUpdateProduct,
  apiSearchProducts,
  apiDeleteProduct,
  apiFetchAllProducts,
} from '@/utils/api/products';
import { apiFetchCategories } from '@/utils/api/categories';
import type { Product, UpdateProductInput } from '@/types/product';
import Image from 'next/image';
import {
  Tag,
  Package,
  TrendingUp,
  Star,
  Edit,
  EyeOff,
  Eye as EyeIcon,
  Plus,
  CheckCircle,
  Trash2,
} from 'lucide-react';
import AdminModal from '@/components/AdminModal';
import { useForm } from 'react-hook-form';
import Pagination from '@/components/Pagination';
import { useDebounce } from '@/hooks/useDebounce';

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [stock, setStock] = useState<'all' | 'in' | 'low' | 'out'>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showToast } = useToast();
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockLoading, setRestockLoading] = useState(false);
  const {
    register: restockRegister,
    handleSubmit: handleRestockSubmit,
    reset: resetRestockForm,
    formState: { errors: restockErrors },
  } = useForm<{ quantity: number }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [globalProductCount, setGlobalProductCount] = useState<number | null>(
    null
  );
  const [globalSalesValue, setGlobalSalesValue] = useState<number | null>(null);

  // Fetch global stats for all products
  const fetchGlobalStats = useCallback(async () => {
    try {
      // Fetch all products (set a high limit to get all)
      const res = await apiFetchAllProducts(1, 1000);
      setGlobalProductCount(res.total);
      setGlobalSalesValue(
        res.products.reduce((sum, p) => sum + (p.stock || 0) * p.price, 0)
      );
    } catch {
      setGlobalProductCount(null);
      setGlobalSalesValue(null);
    }
  }, []);

  // Fetch categories for filter dropdown
  useEffect(() => {
    apiFetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Fetch products with filters
  const limit = 20;
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: import('@/utils/api/products').SearchProductsParams & {
        isActive?: boolean;
      } = {
        q: debouncedSearch,
        category: category || undefined,
        page,
        limit,
      };
      if (status !== 'all') params.isActive = status === 'active';
      if (stock === 'in') params.inStock = true;
      if (stock === 'low') params.inStock = true; // filter low in UI
      if (stock === 'out') params.inStock = false;
      const res = await apiSearchProducts(params);
      let filtered: Product[] = res.products;
      if (stock === 'low') {
        filtered = filtered.filter(
          (p: Product) => p.stock > 0 && p.stock <= (p.restockThreshold || 5)
        );
      }
      setProducts(filtered);
      setTotalPages(res.totalPages || Math.ceil((res.total || 0) / limit) || 1);
      if (globalProductCount === null && typeof res.total === 'number') {
        setGlobalProductCount(res.total);
      }
    } catch {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearch,
    category,
    status,
    stock,
    page,
    limit,
    globalProductCount,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchGlobalStats();
  }, [fetchGlobalStats]);

  const handleEditProduct = async (data: UpdateProductInput) => {
    if (!selectedProduct) return;
    try {
      await apiUpdateProduct(selectedProduct._id, data);
      showToast('success', 'Product updated successfully!');
      setSelectedProduct(null);
      fetchProducts();
      fetchGlobalStats();
    } catch {
      showToast('error', 'Failed to update product.');
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiDeleteProduct(product._id);
      showToast('success', 'Product deleted successfully!');
      fetchProducts();
      fetchGlobalStats();
    } catch {
      showToast('error', 'Failed to delete product.');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await apiToggleProductActive(product._id);
      showToast('success', 'Product status updated!');
      fetchProducts();
      fetchGlobalStats();
    } catch {
      showToast('error', 'Failed to update status.');
    }
  };

  const handleRestock = async (data: { quantity: number }) => {
    if (!restockProduct) return;
    setRestockLoading(true);
    try {
      // Use PUT to update stock (or PATCH if you have a dedicated endpoint)
      await apiUpdateProduct(restockProduct._id, {
        stock: restockProduct.stock + data.quantity,
      });
      showToast('success', 'Product restocked successfully!');
      setRestockProduct(null);
      fetchProducts();
      fetchGlobalStats();
    } catch {
      showToast('error', 'Failed to restock product.');
    } finally {
      setRestockLoading(false);
      resetRestockForm();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-amber-900">Products</h1>
        <AdminButton variant="primary" onClick={() => setShowAddModal(true)}>
          Add Product
        </AdminButton>
      </div>
      {/* Search/Filter Bar */}
      <div className="flex flex-wrap gap-2 items-center mb-4 sm:flex-row flex-col sm:items-center items-stretch">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white min-w-[140px] w-full sm:w-auto"
        />
        <select
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat: string) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setStatus(e.target.value as 'all' | 'active' | 'inactive');
            setPage(1);
          }}
          className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white w-full sm:w-auto"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={stock}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setStock(e.target.value as 'all' | 'in' | 'low' | 'out');
            setPage(1);
          }}
          className="px-3 py-2 border border-amber-200 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 bg-white w-full sm:w-auto"
        >
          <option value="all">All Stock</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 items-center mb-2 text-sm text-gray-700 font-medium sm:flex-row flex-col sm:items-center items-stretch">
        <span>
          Products: {products.length}
          {globalProductCount !== null ? ` of ${globalProductCount}` : ''}
        </span>
        {globalSalesValue !== null && (
          <span>
            Total Inventory Value (all): ₱{globalSalesValue.toLocaleString()}
          </span>
        )}
      </div>
      <div className="bg-white rounded-xl shadow p-2 sm:p-4 border border-amber-200/60">
        {loading ? (
          <AdminLoading message="Loading products..." />
        ) : error ? (
          <AdminError error={error} />
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No products found.
          </div>
        ) : (
          <>
            {/* Table for md+ screens */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="bg-amber-50">
                    <th className="px-2 py-1 text-left font-semibold text-amber-800">
                      Image
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-amber-800">
                      Name
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-amber-800">
                      Category
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-amber-800">
                      Price
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-amber-800">
                      Stock
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-amber-800">
                      Status
                    </th>
                    <th className="px-2 py-1 text-left font-semibold text-amber-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: Product) => {
                    // Stock status logic
                    let stockColor =
                      'text-green-700 bg-green-100 border-green-200';
                    let stockText = 'In Stock';
                    if (product.stock === 0) {
                      stockColor = 'text-red-700 bg-red-100 border-red-200';
                      stockText = 'Out of Stock';
                    } else if (
                      product.stock <= (product.restockThreshold || 5)
                    ) {
                      stockColor =
                        'text-yellow-700 bg-yellow-100 border-yellow-200';
                      stockText = 'Low Stock';
                    }
                    return (
                      <tr
                        key={product._id}
                        className={`border-b last:border-0 ${product.stock === 0 ? 'bg-red-50/40' : product.stock <= (product.restockThreshold || 5) ? 'bg-yellow-50/40' : ''}`}
                      >
                        {/* Image */}
                        <td className="px-2 py-1">
                          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 flex items-center justify-center">
                            <Image
                              src={product.imageUrl || '/placeholder.jpg'}
                              alt={product.name}
                              width={56}
                              height={56}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        </td>
                        {/* Name */}
                        <td className="px-2 py-1 font-medium text-gray-900 max-w-[180px] truncate">
                          <div className="flex items-center gap-2">
                            {product.isFeatured && (
                              <span
                                title="Featured"
                                className="inline-flex items-center"
                              >
                                <Star className="w-4 h-4 text-yellow-400" />
                              </span>
                            )}
                            {product.name}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {product.tags?.slice(0, 2).map((tag: string) => (
                              <span
                                key={tag}
                                className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1"
                              >
                                <Tag className="w-3 h-3" />
                              </span>
                            ))}
                          </div>
                        </td>
                        {/* Category */}
                        <td className="px-2 py-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-800 text-xs rounded-full border border-amber-200">
                            <Tag className="w-3 h-3" />
                            {product.category || 'Uncategorized'}
                          </span>
                        </td>
                        {/* Price */}
                        <td className="px-2 py-1">
                          <span className="font-semibold text-amber-700">
                            ₱{product.price.toLocaleString()}
                          </span>
                          {product.discountActive &&
                            product.discountPercent && (
                              <span className="ml-2 text-xs text-red-500 line-through">
                                ₱{product.price.toLocaleString()}
                              </span>
                            )}
                        </td>
                        {/* Stock */}
                        <td className="px-2 py-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${stockColor}`}
                          >
                            <Package className="w-3 h-3" />
                            {product.stock}
                            <span className="ml-1">{stockText}</span>
                          </span>
                          {product.soldQuantity > 0 && (
                            <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500">
                              <TrendingUp className="w-3 h-3" />
                              Sold: {product.soldQuantity}
                            </span>
                          )}
                        </td>
                        {/* Status */}
                        <td className="px-2 py-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${product.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}
                          >
                            {product.isActive ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <EyeOff className="w-3 h-3" />
                            )}
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span className="ml-2 text-xs text-gray-400">
                            {product.visibility}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-2 py-1 flex gap-1 flex-wrap">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="p-2 rounded hover:bg-blue-50 text-blue-600"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(product)}
                            className={`p-2 rounded ${product.isActive ? 'hover:bg-yellow-50 text-yellow-600' : 'hover:bg-green-50 text-green-600'}`}
                            title={product.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {product.isActive ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <EyeIcon className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="p-2 rounded hover:bg-red-50 text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {(product.stock === 0 ||
                            product.stock <=
                              (product.restockThreshold || 5)) && (
                            <button
                              onClick={() => setRestockProduct(product)}
                              className="p-2 rounded hover:bg-amber-50 text-amber-600"
                              title="Restock"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Card layout for mobile */}
            <div className="md:hidden flex flex-col gap-3">
              {products.map((product: Product) => {
                let stockColor = 'text-green-700 bg-green-100 border-green-200';
                let stockText = 'In Stock';
                if (product.stock === 0) {
                  stockColor = 'text-red-700 bg-red-100 border-red-200';
                  stockText = 'Out of Stock';
                } else if (product.stock <= (product.restockThreshold || 5)) {
                  stockColor =
                    'text-yellow-700 bg-yellow-100 border-yellow-200';
                  stockText = 'Low Stock';
                }
                return (
                  <div
                    key={product._id}
                    className={`rounded-xl border border-amber-100 bg-amber-50/40 shadow-sm p-3 flex gap-3 items-start ${product.stock === 0 ? 'bg-red-50/40' : product.stock <= (product.restockThreshold || 5) ? 'bg-yellow-50/40' : ''}`}
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 flex-shrink-0">
                      <Image
                        src={product.imageUrl || '/placeholder.jpg'}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 truncate">
                          {product.name}
                        </span>
                        {product.isFeatured && (
                          <Star className="w-4 h-4 text-yellow-400" />
                        )}
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full border bg-white text-amber-700 border-amber-200">
                          {product.category || 'Uncategorized'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1">
                        {product.tags?.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-amber-700">
                          ₱{product.price.toLocaleString()}
                        </span>
                        {product.discountActive && product.discountPercent && (
                          <span className="ml-2 text-xs text-red-500 line-through">
                            ₱{product.price.toLocaleString()}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-semibold ${stockColor}`}
                        >
                          <Package className="w-3 h-3" />
                          {product.stock}
                          <span className="ml-1">{stockText}</span>
                        </span>
                        {product.soldQuantity > 0 && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500">
                            <TrendingUp className="w-3 h-3" />
                            Sold: {product.soldQuantity}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <button
                          className="px-3 py-1 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 transition-colors"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 border border-gray-200 transition-colors"
                          onClick={() => setRestockProduct(product)}
                        >
                          Restock
                        </button>
                        <button
                          className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          Delete
                        </button>
                        <button
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${product.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-400 border-gray-200'}`}
                          onClick={() => handleToggleActive(product)}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-2 mb-1 text-xs text-gray-600 font-medium">
              Page {page} of {totalPages}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
      {/* Add Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          fetchProducts();
          fetchGlobalStats();
        }}
      />
      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSave={handleEditProduct}
        />
      )}
      {/* Restock Modal */}
      <AdminModal
        open={!!restockProduct}
        title="Restock Product"
        onClose={() => {
          setRestockProduct(null);
          resetRestockForm();
        }}
        actions={
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <button
              className="w-full sm:w-auto px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold"
              onClick={() => {
                setRestockProduct(null);
                resetRestockForm();
              }}
              disabled={restockLoading}
              type="button"
            >
              Cancel
            </button>
            <button
              className="w-full sm:w-auto px-4 py-2 rounded bg-amber-600 text-white font-semibold hover:bg-amber-700 disabled:opacity-50"
              onClick={handleRestockSubmit(handleRestock)}
              disabled={restockLoading}
              type="submit"
            >
              {restockLoading ? 'Restocking...' : 'Restock'}
            </button>
          </div>
        }
      >
        {/* Custom header for world-class UI/UX */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-900">
              Restock Product
            </h2>
            <p className="text-green-700 text-xs sm:text-sm">
              Add inventory for{' '}
              <span className="font-semibold">
                {restockProduct?.name || ''}
              </span>
            </p>
          </div>
        </div>
        <form
          onSubmit={handleRestockSubmit(handleRestock)}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity to add
          </label>
          <input
            type="number"
            min={1}
            {...restockRegister('quantity', {
              required: 'Quantity is required',
              min: 1,
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
            placeholder="Enter quantity"
            disabled={restockLoading}
          />
          {restockErrors.quantity && (
            <p className="text-xs text-red-600 mt-1">
              {restockErrors.quantity.message}
            </p>
          )}
        </form>
      </AdminModal>
    </div>
  );
}
