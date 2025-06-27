'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductsThunk } from '@/features/product/productThunk';
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/addProductModal'; // ✅ Import the modal

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isAdmin = session?.user?.isAdmin;

  const { products, loading, error } = useAppSelector((state) => state.product);

  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ Modal control
  
  useEffect(() => {
    console.log(`products:`, products)
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  const handleAddProduct = () => {
    setIsModalOpen(true); // ✅ Open modal
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Available Products</h1>
        {isAdmin && (
          <button
            onClick={handleAddProduct}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            + Add Product
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-10 text-center">Loading...</p>
      ) : error ? (
        <p className="py-10 text-center text-red-500">{error}</p>
      ) : products.length === 0 && !isAdmin ? (
        <p className="py-10 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onRefresh={() => dispatch(fetchProductsThunk())}
            />
          ))}
        </div>
      )}

      {/* ✅ Add Product Modal */}
      {isAdmin && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </main>
  );
}
