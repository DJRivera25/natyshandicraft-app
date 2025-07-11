'use client';

import React, { useState, useEffect } from 'react';
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
// Import MUI Slider
import Slider from '@mui/material/Slider';

interface ProductSidebarProps {
  onSearchChange: (value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  categories: string[];
  onSpecialFeaturesChange?: (features: {
    isFeatured?: boolean;
    discountActive?: boolean;
    inStock?: boolean;
  }) => void;
}

const ProductSidebar: React.FC<ProductSidebarProps> = ({
  onSearchChange,
  onPriceChange,
  onCategoryChange,
  onReset,
  isSidebarOpen,
  setIsSidebarOpen,
  categories,
  onSpecialFeaturesChange,
}) => {
  // Search input state (local, like slider)
  const [searchInput, setSearchInput] = useState('');
  // Track if user is composing (for IME)
  const [isComposing, setIsComposing] = useState(false);
  // Price range slider state (local, like demo)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    price: true,
    category: true,
    features: true,
  });

  // Special features state
  const [specialFeatures, setSpecialFeatures] = useState<{
    isFeatured?: boolean;
    discountActive?: boolean;
    inStock?: boolean;
  }>({});

  // Basic demo slider state

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

  // Search input handlers
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const handleSearchInputBlur = () => {
    if (!isComposing) onSearchChange(searchInput);
  };
  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter' && !isComposing) {
      onSearchChange(searchInput);
    }
  };
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    onCategoryChange(category);
  };

  const handleReset = () => {
    setSearchInput('');
    setPriceRange([0, 10000]);
    setSelectedCategory('All');

    onReset();
  };

  // Handler for toggling special features
  const handleSpecialFeatureToggle = (
    key: 'isFeatured' | 'discountActive' | 'inStock'
  ) => {
    setSpecialFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (onSpecialFeaturesChange) onSpecialFeaturesChange(next);
      return next;
    });
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
    priceRange[0] > 0 ||
    priceRange[1] < 10000;

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
                    onChange={handleSearchInputChange}
                    onBlur={handleSearchInputBlur}
                    onKeyDown={handleSearchInputKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
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
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Price Range
                  </label>
                  <div className="w-full pt-14 pb-2 flex flex-col items-center">
                    {' '}
                    {/* Increased top padding */}
                    <Slider
                      value={priceRange}
                      min={0}
                      max={10000}
                      step={10}
                      onChange={(_, newValue) => {
                        if (Array.isArray(newValue)) {
                          setPriceRange(newValue as [number, number]);
                          onPriceChange(newValue[0], newValue[1]);
                        }
                      }}
                      valueLabelDisplay="on"
                      valueLabelFormat={(v) => `₱${v.toLocaleString()}`}
                      sx={{
                        color: '#f59e42',
                        height: 10,
                        padding: '40px 0 20px 0',
                        '& .MuiSlider-thumb': {
                          height: 36,
                          width: 36,
                          backgroundColor: '#fff',
                          border: '4px solid #f59e42',
                          boxShadow:
                            '0 6px 24px rgba(0,0,0,0.13), 0 0 0 2px #fde68a',
                          transition: 'box-shadow 0.2s, border-color 0.2s',
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow:
                              '0 0 0 8px #fde68a, 0 6px 24px rgba(0,0,0,0.13)',
                            borderColor: '#fbbf24',
                          },
                          '&:after': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            left: 8,
                            top: 8,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            boxShadow: 'inset 0 2px 8px #fbbf24',
                            opacity: 0.15,
                          },
                        },
                        '& .MuiSlider-rail': {
                          background:
                            'linear-gradient(90deg, #fde68a 0%, #fbbf24 100%)',
                          opacity: 1,
                          height: 10,
                          borderRadius: 5,
                          boxShadow: '0 2px 8px rgba(251,191,36,0.10)',
                        },
                        '& .MuiSlider-track': {
                          background:
                            'linear-gradient(90deg, #fbbf24 0%, #f59e42 100%)',
                          height: 10,
                          borderRadius: 5,
                          boxShadow: '0 2px 8px rgba(245,158,66,0.13)',
                        },
                        '& .MuiSlider-valueLabel': {
                          background: '#f59e42',
                          color: '#fff',
                          borderRadius: '999px',
                          fontWeight: 700,
                          fontSize: '1.05em',
                          top: -52,
                          padding: '10px 18px',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                          zIndex: 100,
                          '::after': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            bottom: -8,
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid #f59e42',
                          },
                        },
                      }}
                      disableSwap
                    />
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
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                      specialFeatures.isFeatured
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 shadow-lg'
                        : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                    onClick={() => handleSpecialFeatureToggle('isFeatured')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Featured Products
                        </div>
                        <div className="text-xs">Handpicked favorites</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.isFeatured ? 'border-white bg-yellow-400' : 'border-gray-300 bg-white'}`}
                    ></div>
                  </button>
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                      specialFeatures.discountActive
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-400 shadow-lg'
                        : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                    onClick={() => handleSpecialFeatureToggle('discountActive')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">On Sale</div>
                        <div className="text-xs">Special discounts</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.discountActive ? 'border-white bg-green-400' : 'border-gray-300 bg-white'}`}
                    ></div>
                  </button>
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                      specialFeatures.inStock
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-400 shadow-lg'
                        : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                    onClick={() => handleSpecialFeatureToggle('inStock')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">In Stock</div>
                        <div className="text-xs">Available now</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.inStock ? 'border-white bg-blue-400' : 'border-gray-300 bg-white'}`}
                    ></div>
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
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Price: ₱{priceRange[0].toLocaleString()} - ₱
                      {priceRange[1].toLocaleString()}
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
                    onChange={handleSearchInputChange}
                    onBlur={handleSearchInputBlur}
                    onKeyDown={handleSearchInputKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
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
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    Price Range
                  </label>
                  <div className="w-full pt-8 pb-2 flex flex-col items-center">
                    <Slider
                      value={priceRange}
                      min={0}
                      max={10000}
                      step={10}
                      onChange={(_, newValue) => {
                        if (Array.isArray(newValue)) {
                          setPriceRange(newValue as [number, number]);
                          onPriceChange(newValue[0], newValue[1]);
                        }
                      }}
                      valueLabelDisplay="on"
                      valueLabelFormat={(v) => `₱${v.toLocaleString()}`}
                      sx={{
                        color: '#f59e42',
                        height: 8,
                        padding: '30px 0',
                        '& .MuiSlider-thumb': {
                          height: 32,
                          width: 32,
                          backgroundColor: '#fff',
                          border: '4px solid #f59e42',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 0 0 6px #fde68a',
                            borderColor: '#fbbf24',
                          },
                        },
                        '& .MuiSlider-rail': {
                          background:
                            'linear-gradient(to right, #fde68a, #fbbf24)',
                          opacity: 1,
                          height: 8,
                          borderRadius: 4,
                        },
                        '& .MuiSlider-track': {
                          background:
                            'linear-gradient(to right, #fbbf24, #f59e42)',
                          height: 8,
                          borderRadius: 4,
                        },
                        '& .MuiSlider-valueLabel': {
                          background: '#f59e42',
                          color: '#fff',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '0.95em',
                          top: -36,
                          padding: '6px 12px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                        },
                      }}
                      disableSwap
                    />
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
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                      specialFeatures.isFeatured
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-yellow-400 shadow-lg'
                        : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                    onClick={() => handleSpecialFeatureToggle('isFeatured')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Featured Products
                        </div>
                        <div className="text-xs">Handpicked favorites</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.isFeatured ? 'border-white bg-yellow-400' : 'border-gray-300 bg-white'}`}
                    ></div>
                  </button>
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                      specialFeatures.discountActive
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white border-green-400 shadow-lg'
                        : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                    onClick={() => handleSpecialFeatureToggle('discountActive')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-green-400 to-green-500 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">On Sale</div>
                        <div className="text-xs">Special discounts</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.discountActive ? 'border-white bg-green-400' : 'border-gray-300 bg-white'}`}
                    ></div>
                  </button>
                  <button
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all shadow-sm ${
                      specialFeatures.inStock
                        ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-blue-400 shadow-lg'
                        : 'bg-white/90 text-gray-700 border-gray-300 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                    onClick={() => handleSpecialFeatureToggle('inStock')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">In Stock</div>
                        <div className="text-xs">Available now</div>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 border-2 rounded-full transition-all ${specialFeatures.inStock ? 'border-white bg-blue-400' : 'border-gray-300 bg-white'}`}
                    ></div>
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
                {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Price: ₱{priceRange[0].toLocaleString()} - ₱
                      {priceRange[1].toLocaleString()}
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
