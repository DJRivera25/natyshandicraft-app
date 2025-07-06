'use client';

import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCategoriesThunk } from '@/features/category/categoryThunk';
import { searchProductsThunk } from '@/features/product/productThunk';

import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/addProductModal';
import PageWrapper from '@/components/PageWrapper';
import ProductSidebar from '@/components/ProductsFilterSidebar';
import { useHasMounted } from '@/utils/useHasMounted';

export default function ProductsPage() {
  const hasMounted = useHasMounted();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  const { products, loading, error, totalPages, query } = useAppSelector(
    (state) => state.product
  );
  const { categories } = useAppSelector((state) => state.category);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState(query);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [category, setCategory] = useState('All');
  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    dispatch(fetchCategoriesThunk());
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 400);
    return () => clearTimeout(handler);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    dispatch(
      searchProductsThunk({
        q,
        minPrice: debouncedMinPrice,
        maxPrice: debouncedMaxPrice,
        category: category !== 'All' ? category : '',
        page,
        limit: 10,
        sortBy,
      })
    );
  }, [page, q, debouncedMinPrice, debouncedMaxPrice, category, sortBy]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQ(searchInput);
    }, 500);
  }, [searchInput]);

  const handleAddProduct = () => setIsModalOpen(true);

  const resetFilters = () => {
    setSearchInput('');
    setQ('');
    setMinPrice(0);
    setMaxPrice(10000);
    setCategory('All');
    setPage(1);
  };

  // 🛡️ Hydration safety
  if (!hasMounted || !Array.isArray(products)) return null;

  return (
    <PageWrapper>
      <section className="h-full flex justify-center overflow-hidden">
        <div className="w-full max-w-[1400px] flex">
          {/* Sidebar */}
          <ProductSidebar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            category={category}
            setCategory={setCategory}
            resetFilters={resetFilters}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            categories={categories}
          />

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white border-b shadow-sm px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-lg sm:text-2xl font-bold text-amber-900">
                Available Products
              </h1>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-1 rounded border text-sm sm:text-base ${
                          pageNum === page
                            ? 'bg-amber-600 text-white font-semibold'
                            : 'bg-white text-amber-700 hover:bg-amber-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-amber-700">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1); // reset page when sorting
                  }}
                  className="text-sm border border-amber-300 rounded px-2 py-1"
                >
                  <option value="newest">Newest</option>
                  <option value="priceAsc">Price: Low to High</option>
                  <option value="priceDesc">Price: High to Low</option>
                </select>
              </div>
              {isAdmin && (
                <button
                  onClick={handleAddProduct}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
                >
                  + Add Product
                </button>
              )}
            </div>

            {/* Scrollable Product List */}
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div
                  className="grid gap-5 justify-center"
                  style={{
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(240px, 1fr))',
                    maxWidth: '1300px',
                    margin: '0 auto',
                  }}
                >
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-amber-100 animate-pulse h-48 rounded-md"
                    />
                  ))}
                </div>
              ) : error ? (
                <p className="py-10 text-center text-red-500 text-sm sm:text-base">
                  {error}
                </p>
              ) : products.length === 0 && !isAdmin ? (
                <p className="py-10 text-center text-gray-500 text-sm">
                  No products found.
                </p>
              ) : (
                <div
                  className="grid gap-5 justify-center"
                  style={{
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(240px, 1fr))',
                    maxWidth: '1300px',
                    margin: '0 auto',
                  }}
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Product Modal */}
          {isAdmin && (
            <AddProductModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
