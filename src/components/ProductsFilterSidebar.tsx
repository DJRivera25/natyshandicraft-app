'use client';

import React, { useState, useEffect } from 'react';
import {
  MobileToggle,
  MobileBackdrop,
  MobileSidebar,
  DesktopSidebar,
} from './ProductsFilterSidebar/index';
import { useDebounce } from '@/hooks/useDebounce';
import type { SpecialFeatures } from './ProductsFilterSidebar/SpecialFeaturesFilter';

interface ProductSidebarProps {
  onSearchChange: (value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onCategoryChange: (value: string) => void;
  onReset: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  categories: string[];
  onSpecialFeaturesChange?: (features: SpecialFeatures) => void;
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
  const debouncedSearchInput = useDebounce(searchInput, 400);
  // Track if user is composing (for IME)
  const [isComposing, setIsComposing] = useState(false);
  // Price range slider state (local, like demo)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedSections, setExpandedSections] = useState({
    search: false,
    price: false,
    category: false,
    features: false,
  });

  // Special features state
  const [specialFeatures, setSpecialFeatures] = useState<SpecialFeatures>({});

  // Debounced search effect
  useEffect(() => {
    if (!isComposing) {
      onSearchChange(debouncedSearchInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchInput]);

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
  const handleSearchInputBlur = () => {};
  const handleSearchInputKeyDown = () => {};
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
    setSpecialFeatures({});

    onReset();
  };

  // Handler for toggling special features
  const handleSpecialFeatureToggle = (
    key: 'isFeatured' | 'discountActive' | 'inStock' | 'isBestSeller'
  ) => {
    setSpecialFeatures((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (onSpecialFeaturesChange) onSpecialFeaturesChange(next);
      return next;
    });
  };

  const toggleSection = (
    section: 'search' | 'price' | 'category' | 'features'
  ) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
    onPriceChange(value[0], value[1]);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileToggle
        isSidebarOpen={isSidebarOpen}
        onToggle={handleSidebarToggle}
      />

      {/* Mobile Backdrop */}
      <MobileBackdrop
        isSidebarOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isSidebarOpen={isSidebarOpen}
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        onSearchInputBlur={handleSearchInputBlur}
        onSearchInputKeyDown={handleSearchInputKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        specialFeatures={specialFeatures}
        onSpecialFeatureToggle={handleSpecialFeatureToggle}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        onReset={handleReset}
      />

      {/* Desktop Sidebar */}
      <DesktopSidebar
        searchInput={searchInput}
        onSearchInputChange={handleSearchInputChange}
        onSearchInputBlur={handleSearchInputBlur}
        onSearchInputKeyDown={handleSearchInputKeyDown}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        priceRange={priceRange}
        onPriceRangeChange={handlePriceRangeChange}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        specialFeatures={specialFeatures}
        onSpecialFeatureToggle={handleSpecialFeatureToggle}
        expandedSections={expandedSections}
        onToggleSection={toggleSection}
        onReset={handleReset}
      />
    </>
  );
};

export default ProductSidebar;
