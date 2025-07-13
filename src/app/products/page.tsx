'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategoriesThunk } from '@/features/category/categoryThunk';
import { searchProductsThunk } from '@/features/product/productThunk';

import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/addProductModal';
import PageWrapper from '@/components/PageWrapper';
import ProductSidebar from '@/components/ProductsFilterSidebar';
import { useHasMounted } from '@/utils/useHasMounted';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Package,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export default function ProductsPage() {
  const hasMounted = useHasMounted();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  const { products, loading, error, totalPages } = useAppSelector(
    (state) => state.product
  );
  const { categories } = useAppSelector((state) => state.category);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [debouncedQ, setDebouncedQ] = useState('');
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(0);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(10000);
  const [category, setCategory] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [specialFeatures, setSpecialFeatures] = useState<{
    isFeatured?: boolean;
    discountActive?: boolean;
    inStock?: boolean;
  }>({});

  // Mobile search internal state
  const [mobileSearchInput, setMobileSearchInput] = useState('');

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      searchProductsThunk({
        q: debouncedQ,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        category: category !== 'All' ? category : '',
        page,
        limit: 12,
        sortBy,
        ...specialFeatures,
      })
    );
  }, [
    dispatch,
    page,
    debouncedQ,
    debouncedMinPrice,
    debouncedMaxPrice,
    category,
    sortBy,
    specialFeatures,
  ]);

  // Stabilize functions to prevent sidebar re-renders
  const handleAddProduct = useCallback(() => setIsModalOpen(true), []);

  const resetFilters = useCallback(() => {
    setDebouncedQ('');
    setDebouncedMinPrice(0);
    setDebouncedMaxPrice(10000);
    setCategory('All');
    setPage(1);
  }, []);

  // Create truly stable callbacks using useCallback
  const handleSearchChange = useCallback((value: string) => {
    setDebouncedQ(value);
  }, []);

  const handlePriceChange = useCallback((min: number, max: number) => {
    setDebouncedMinPrice(min);
    setDebouncedMaxPrice(max);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
  }, []);

  const handleSidebarToggle = useCallback((value: boolean) => {
    setIsSidebarOpen(value);
  }, []);

  const handleSpecialFeaturesChange = useCallback(
    (features: {
      isFeatured?: boolean;
      discountActive?: boolean;
      inStock?: boolean;
    }) => {
      setSpecialFeatures(features);
      setPage(1);
    },
    []
  );

  const handleProductUpdate = useCallback(() => {
    // Refresh the products list to show updated data
    dispatch(
      searchProductsThunk({
        q: debouncedQ,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        category: category !== 'All' ? category : '',
        page,
        limit: 12,
        sortBy,
        ...specialFeatures,
      })
    );
  }, [
    dispatch,
    debouncedQ,
    debouncedMinPrice,
    debouncedMaxPrice,
    category,
    page,
    sortBy,
    specialFeatures,
  ]);

  const getSortLabel = (value: string) => {
    switch (value) {
      case 'newest':
        return 'Newest First';
      case 'priceAsc':
        return 'Price: Low to High';
      case 'priceDesc':
        return 'Price: High to Low';
      case 'nameAsc':
        return 'Name: A to Z';
      case 'nameDesc':
        return 'Name: Z to A';
      default:
        return 'Newest First';
    }
  };

  const getSortIcon = (value: string) => {
    switch (value) {
      case 'priceAsc':
        return <SortAsc className="w-4 h-4" />;
      case 'priceDesc':
        return <SortDesc className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  // 🛡️ Hydration safety
  if (!hasMounted || !Array.isArray(products)) return null;

  return (
    <>
      <PageWrapper>
        <div className="min-h-screen bg-gradient-to-br from-amber-50/30 to-white">
          <div className="max-w-[1400px] mx-auto">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-amber-200/60 shadow-sm"
            >
              <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  {/* Title and Search */}
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-amber-900">
                        Our Products
                      </h1>
                      <p className="text-amber-700 text-xs sm:text-sm">
                        Discover our handcrafted treasures
                      </p>
                    </div>

                    {/* Mobile Search */}
                    <div className="relative sm:hidden">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={mobileSearchInput}
                        onChange={(e) => {
                          const value = e.target.value;
                          setMobileSearchInput(value);
                          // Debounce the search update
                          setTimeout(() => {
                            setDebouncedQ(value);
                          }, 300);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Sort Dropdown */}
                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-xs sm:text-sm font-medium"
                      >
                        {getSortIcon(sortBy)}
                        <span className="hidden sm:inline">
                          {getSortLabel(sortBy)}
                        </span>
                        <span className="sm:hidden">Sort</span>
                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                      </motion.button>

                      <AnimatePresence>
                        {showFilters && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl py-2 min-w-[180px] sm:min-w-[200px] z-50"
                          >
                            {[
                              {
                                value: 'newest',
                                label: 'Newest First',
                                icon: Package,
                              },
                              {
                                value: 'priceAsc',
                                label: 'Price: Low to High',
                                icon: SortAsc,
                              },
                              {
                                value: 'priceDesc',
                                label: 'Price: High to Low',
                                icon: SortDesc,
                              },
                              {
                                value: 'nameAsc',
                                label: 'Name: A to Z',
                                icon: Package,
                              },
                              {
                                value: 'nameDesc',
                                label: 'Name: Z to A',
                                icon: Package,
                              },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setSortBy(option.value);
                                  setShowFilters(false);
                                  setPage(1);
                                }}
                                className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-left hover:bg-amber-50 transition-colors text-xs sm:text-sm"
                              >
                                <option.icon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                                <span
                                  className={
                                    sortBy === option.value
                                      ? 'font-medium text-amber-700'
                                      : 'text-gray-700'
                                  }
                                >
                                  {option.label}
                                </span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Add Product Button (Admin) */}
                    {isAdmin && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddProduct}
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Add Product</span>
                        <span className="sm:hidden">Add</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {/* Results Summary */}
                <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-amber-200/60">
                  <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                      {products.length} products
                    </span>
                    {(debouncedQ ||
                      category !== 'All' ||
                      debouncedMinPrice > 0 ||
                      debouncedMaxPrice < 10000) && (
                      <span className="flex items-center gap-1 text-amber-600">
                        <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">
                          Filters applied
                        </span>
                        <span className="sm:hidden">Filtered</span>
                      </span>
                    )}
                  </div>

                  {/* Pagination Info */}
                  {totalPages > 1 && (
                    <div className="text-xs sm:text-sm text-gray-500">
                      Page {page} of {totalPages}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex relative">
              {/* Sidebar */}
              <ProductSidebar
                onSearchChange={handleSearchChange}
                onPriceChange={handlePriceChange}
                onCategoryChange={handleCategoryChange}
                onReset={resetFilters}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={handleSidebarToggle}
                categories={categories}
                onSpecialFeaturesChange={handleSpecialFeaturesChange}
              />

              {/* Products Grid */}
              <div className="flex-1 p-2 sm:p-3 md:p-4 lg:p-6 min-w-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full"
                    />
                    <p className="mt-4 text-gray-600">Loading products...</p>
                  </div>
                ) : error ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
                      {error}
                    </p>
                  </motion.div>
                ) : products.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <Package className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 text-center max-w-md">
                      {debouncedQ ||
                      category !== 'All' ||
                      debouncedMinPrice > 0 ||
                      debouncedMaxPrice < 10000
                        ? 'Try adjusting your filters to find more products.'
                        : "We're working on adding more amazing products for you."}
                    </p>
                    {(debouncedQ ||
                      category !== 'All' ||
                      debouncedMinPrice > 0 ||
                      debouncedMaxPrice < 10000) && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetFilters}
                        className="mt-4 px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        Clear Filters
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <>
                    {/* Products Grid */}
                    <motion.div
                      layout
                      className={`grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr`}
                    >
                      <AnimatePresence mode="popLayout">
                        {products.map((product, index) => (
                          <motion.div
                            key={product._id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.05,
                              type: 'spring',
                              stiffness: 200,
                              damping: 20,
                            }}
                          >
                            <ProductCard
                              product={product}
                              onProductUpdate={handleProductUpdate}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mt-12"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </motion.button>

                        <div className="flex gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const pageNum = i + 1;
                              return (
                                <motion.button
                                  key={pageNum}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setPage(pageNum)}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    pageNum === page
                                      ? 'bg-amber-500 text-white shadow-lg'
                                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300'
                                  }`}
                                >
                                  {pageNum}
                                </motion.button>
                              );
                            }
                          )}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setPage(Math.min(totalPages, page + 1))
                          }
                          disabled={page === totalPages}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </motion.div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>

      {/* Add Product Modal - Outside PageWrapper */}
      {isAdmin && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
