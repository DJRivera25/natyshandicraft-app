'use client';

import React from 'react';
import { Search } from 'lucide-react';
import PriceRangeSlider from './PriceRangeSlider';

interface ProductSidebarProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  minPrice: number;
  setMinPrice: (val: number) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  category: string;
  setCategory: (val: string) => void;
  resetFilters: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  categories: string[];
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  searchInput,
  setSearchInput,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  category,
  setCategory,
  resetFilters,
  isSidebarOpen,
  setIsSidebarOpen,
  categories,
}) => {
  return (
    <>
      {/* Mobile Toggle Button */}
      <div
        className={`fixed z-50 transition-all duration-300 md:hidden ${
          isSidebarOpen ? 'left-[75%]' : 'right-4'
        } top-20`}
      >
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white text-amber-700 border border-amber-400 rounded px-3 py-1 text-sm shadow"
        >
          {isSidebarOpen ? '✕ Close Filters' : '☰ Open Filters'}
        </button>
      </div>

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:static pt-24 md:pt-0 z-20 top-0 left-0 h-[calc(100vh-80px)] w-3/4 md:w-80 px-6 py-6 bg-white border-r border-amber-200 shadow-md overflow-y-auto transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col gap-10">
          {/* Search Section */}
          <div className="flex items-center border border-amber-300 rounded-lg px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-amber-500 mt-2">
            <Search className="h-4 w-4 text-amber-700 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full text-sm outline-none bg-transparent"
            />
          </div>

          {/* Price Filter */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-amber-800">Price</p>
            <PriceRangeSlider
              values={[minPrice, maxPrice]}
              onChange={([newMin, newMax]) => {
                setMinPrice(newMin);
                setMaxPrice(newMax);
              }}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <p className="text-lg font-semibold text-amber-800">Categories</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1 rounded-full border text-sm font-medium transition duration-150 ease-in-out whitespace-nowrap ${
                    category === cat
                      ? 'bg-amber-600 text-white'
                      : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetFilters}
            className="text-sm text-red-600 underline hover:text-red-800 self-start"
          >
            Clear Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProductSidebar;
