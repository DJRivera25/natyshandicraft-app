'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  DollarSign,
  Tag,
  RefreshCw,
  ChevronDown,
  Star,
  TrendingUp,
  Package,
  Sparkles,
  Zap,
} from 'lucide-react';

interface ProductSidebarProps {
  onSearchChange: (value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  categories: string[];
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  onSearchChange,
  onPriceChange,
  onCategoryChange,
  onReset,
  isSidebarOpen,
  setIsSidebarOpen,
  categories,
}) => {
  // Simple internal state
  const [searchInput, setSearchInput] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    price: true,
    category: true,
    features: true,
  });

  // Timeout refs for debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const priceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSidebarOpen]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    };
  }, []);

  // Simple handlers without any memoization
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinPrice(value);

    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    priceTimeoutRef.current = setTimeout(() => {
      onPriceChange(value, maxPrice);
    }, 300);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxPrice(value);

    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    priceTimeoutRef.current = setTimeout(() => {
      onPriceChange(minPrice, value);
    }, 300);
  };

  const handlePriceRangeChange = ([newMin, newMax]: [number, number]) => {
    setMinPrice(newMin);
    setMaxPrice(newMax);

    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);
    priceTimeoutRef.current = setTimeout(() => {
      onPriceChange(newMin, newMax);
    }, 300);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleReset = () => {
    setSearchInput('');
    setMinPrice(0);
    setMaxPrice(10000);
    setSelectedCategory('All');

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (priceTimeoutRef.current) clearTimeout(priceTimeoutRef.current);

    onReset();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters =
    searchInput ||
    selectedCategory !== 'All' ||
    minPrice > 0 ||
    maxPrice < 10000;

  // Enhanced range slider component with better styling
  const EnhancedRangeSlider = ({
    values,
    onChange,
  }: {
    values: [number, number];
    onChange: (range: [number, number]) => void;
  }) => {
    const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
    const sliderRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent, type: 'min' | 'max') => {
      setIsDragging(type);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newValue = Math.round((percentage * 10000) / 10) * 10; // Round to nearest 10

      if (isDragging === 'min') {
        const clampedValue = Math.min(newValue, values[1] - 100);
        onChange([clampedValue, values[1]]);
      } else {
        const clampedValue = Math.max(newValue, values[0] + 100);
        onChange([values[0], clampedValue]);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (e: React.TouchEvent, type: 'min' | 'max') => {
      setIsDragging(type);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging || !sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newValue = Math.round((percentage * 10000) / 10) * 10;

      if (isDragging === 'min') {
        const clampedValue = Math.min(newValue, values[1] - 100);
        onChange([clampedValue, values[1]]);
      } else {
        const clampedValue = Math.max(newValue, values[0] + 100);
        onChange([values[0], clampedValue]);
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(null);
    };

    const minPercentage = (values[0] / 10000) * 100;
    const maxPercentage = (values[1] / 10000) * 100;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600">
              ₱{values[0].toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Minimum</div>
          </div>
          <div className="w-8 h-0.5 bg-gradient-to-r from-amber-200 to-amber-400"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600">
              ₱{values[1].toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Maximum</div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-500" />
            Price Range
          </label>

          {/* Single Bar Slider */}
          <div
            ref={sliderRef}
            className="relative h-8 flex items-center"
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Track Background */}
            <div className="absolute inset-0 h-2 bg-gray-200 rounded-full"></div>

            {/* Active Track */}
            <div
              className="absolute h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
              style={{
                left: `${minPercentage}%`,
                width: `${maxPercentage - minPercentage}%`,
              }}
            ></div>

            {/* Min Thumb */}
            <div
              className={`absolute w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 ${
                isDragging === 'min' ? 'scale-110 z-10' : 'hover:scale-105'
              }`}
              style={{ left: `${minPercentage}%` }}
              onMouseDown={(e) => handleMouseDown(e, 'min')}
              onTouchStart={(e) => handleTouchStart(e, 'min')}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                ₱{values[0].toLocaleString()}
              </div>
            </div>

            {/* Max Thumb */}
            <div
              className={`absolute w-6 h-6 bg-white border-2 border-amber-500 rounded-full shadow-lg cursor-pointer transform -translate-x-1/2 ${
                isDragging === 'max' ? 'scale-110 z-10' : 'hover:scale-105'
              }`}
              style={{ left: `${maxPercentage}%` }}
              onMouseDown={(e) => handleMouseDown(e, 'max')}
              onTouchStart={(e) => handleTouchStart(e, 'max')}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-amber-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                ₱{values[1].toLocaleString()}
              </div>
            </div>
          </div>

          {/* Manual Input Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                value={values[0]}
                onChange={(e) => {
                  const newMin = Number(e.target.value);
                  onChange([newMin, Math.max(newMin + 100, values[1])]);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/90"
                placeholder="0"
                min="0"
                max={values[1] - 100}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input
                type="number"
                value={values[1]}
                onChange={(e) => {
                  const newMax = Number(e.target.value);
                  onChange([Math.min(values[0], newMax - 100), newMax]);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/90"
                placeholder="10000"
                min={values[0] + 100}
                max="10000"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Enhanced Mobile Toggle Button */}
      <div className="fixed z-50 md:hidden top-20 right-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white border border-amber-400 rounded-full px-6 py-3 text-sm shadow-xl hover:shadow-2xl"
        >
          {isSidebarOpen ? (
            <>
              <X className="w-4 h-4" />
              <span className="ml-2">Close</span>
            </>
          ) : (
            <>
              <Filter className="w-4 h-4" />
              <span className="ml-2">Filters</span>
            </>
          )}
        </button>
      </div>

      {/* Enhanced Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Enhanced Mobile Sidebar */}
      <aside
        className={`fixed md:hidden z-50 top-0 left-0 h-screen w-80 max-w-[85vw] bg-gradient-to-b from-white to-amber-50/30 border-r border-amber-200/60 shadow-2xl overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between pb-6 border-b border-amber-200/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl shadow-lg">
                <SlidersHorizontal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Smart Filters
                </h2>
                <p className="text-sm text-gray-600">
                  Refine your search with precision
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
              title="Reset all filters"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Search Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('search')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">
                  Search Products
                </span>
              </div>
              <div
                className={`${expandedSections.search ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.search && (
              <div className="px-5 pb-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category, or tags..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white/90 backdrop-blur-sm shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Price Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('price')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Price Range</span>
              </div>
              <div
                className={`${expandedSections.price ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.price && (
              <div className="px-5 pb-5">
                <div className="space-y-6">
                  <EnhancedRangeSlider
                    values={[minPrice, maxPrice]}
                    onChange={handlePriceRangeChange}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/90"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/90"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Category Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('category')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Categories</span>
              </div>
              <div
                className={`${expandedSections.category ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.category && (
              <div className="px-5 pb-5">
                <div className="space-y-3">
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left ${
                      selectedCategory === 'All'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4" />
                      <span>All Categories</span>
                      {selectedCategory === 'All' && (
                        <Sparkles className="w-4 h-4 ml-auto" />
                      )}
                    </div>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4" />
                        <span>{cat}</span>
                        {selectedCategory === cat && (
                          <Sparkles className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Features Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('features')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">
                  Special Features
                </span>
              </div>
              <div
                className={`${expandedSections.features ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.features && (
              <div className="px-5 pb-5">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-white/90 border border-gray-300 rounded-xl hover:bg-amber-50 hover:border-amber-300 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Featured Products
                        </div>
                        <div className="text-xs text-gray-500">
                          Handpicked favorites
                        </div>
                      </div>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-white/90 border border-gray-300 rounded-xl hover:bg-amber-50 hover:border-amber-300 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          On Sale
                        </div>
                        <div className="text-xs text-gray-500">
                          Special discounts
                        </div>
                      </div>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-white/90 border border-gray-300 rounded-xl hover:bg-amber-50 hover:border-amber-300 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          In Stock
                        </div>
                        <div className="text-xs text-gray-500">
                          Available now
                        </div>
                      </div>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-xl flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            Clear All Filters
          </button>

          {/* Enhanced Active Filters Summary */}
          {hasActiveFilters && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-bold text-amber-800">
                  Active Filters
                </h4>
              </div>
              <div className="space-y-2 text-sm text-amber-700">
                {searchInput && (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Search: &ldquo;{searchInput}&rdquo;</span>
                  </div>
                )}
                {selectedCategory !== 'All' && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Category: {selectedCategory}</span>
                  </div>
                )}
                {(minPrice > 0 || maxPrice < 10000) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Price: ₱{minPrice.toLocaleString()} - ₱
                      {maxPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Enhanced Desktop Sidebar */}
      <aside className="hidden md:block w-80 bg-gradient-to-b from-white to-amber-50/30 border-r border-amber-200/60 shadow-lg overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between pb-6 border-b border-amber-200/60">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-xl shadow-lg">
                <SlidersHorizontal className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Smart Filters
                </h2>
                <p className="text-sm text-gray-600">
                  Refine your search with precision
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
              title="Reset all filters"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Enhanced Search Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('search')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">
                  Search Products
                </span>
              </div>
              <div
                className={`${expandedSections.search ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.search && (
              <div className="px-5 pb-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, category, or tags..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white/90 backdrop-blur-sm shadow-sm"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Price Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('price')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Price Range</span>
              </div>
              <div
                className={`${expandedSections.price ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.price && (
              <div className="px-5 pb-5">
                <div className="space-y-6">
                  <EnhancedRangeSlider
                    values={[minPrice, maxPrice]}
                    onChange={handlePriceRangeChange}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/90"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/90"
                        placeholder="10000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Category Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('category')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Categories</span>
              </div>
              <div
                className={`${expandedSections.category ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.category && (
              <div className="px-5 pb-5">
                <div className="space-y-3">
                  <button
                    onClick={() => handleCategorySelect('All')}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left ${
                      selectedCategory === 'All'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                        : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-4 h-4" />
                      <span>All Categories</span>
                      {selectedCategory === 'All' && (
                        <Sparkles className="w-4 h-4 ml-auto" />
                      )}
                    </div>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left ${
                        selectedCategory === cat
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                          : 'bg-white/90 text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Tag className="w-4 h-4" />
                        <span>{cat}</span>
                        {selectedCategory === cat && (
                          <Sparkles className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Features Filter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/60 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('features')}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-amber-50/50"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">
                  Special Features
                </span>
              </div>
              <div
                className={`${expandedSections.features ? 'rotate-180' : 'rotate-0'}`}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </div>
            </button>

            {expandedSections.features && (
              <div className="px-5 pb-5">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-white/90 border border-gray-300 rounded-xl hover:bg-amber-50 hover:border-amber-300 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          Featured Products
                        </div>
                        <div className="text-xs text-gray-500">
                          Handpicked favorites
                        </div>
                      </div>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-white/90 border border-gray-300 rounded-xl hover:bg-amber-50 hover:border-amber-300 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          On Sale
                        </div>
                        <div className="text-xs text-gray-500">
                          Special discounts
                        </div>
                      </div>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  </button>

                  <button className="w-full flex items-center justify-between p-4 bg-white/90 border border-gray-300 rounded-xl hover:bg-amber-50 hover:border-amber-300 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          In Stock
                        </div>
                        <div className="text-xs text-gray-500">
                          Available now
                        </div>
                      </div>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Reset Button */}
          <button
            onClick={handleReset}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-red-800 shadow-xl flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-5 h-5" />
            Clear All Filters
          </button>

          {/* Enhanced Active Filters Summary */}
          {hasActiveFilters && (
            <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-bold text-amber-800">
                  Active Filters
                </h4>
              </div>
              <div className="space-y-2 text-sm text-amber-700">
                {searchInput && (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    <span>Search: &ldquo;{searchInput}&rdquo;</span>
                  </div>
                )}
                {selectedCategory !== 'All' && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Category: {selectedCategory}</span>
                  </div>
                )}
                {(minPrice > 0 || maxPrice < 10000) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Price: ₱{minPrice.toLocaleString()} - ₱
                      {maxPrice.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default ProductSidebar;
