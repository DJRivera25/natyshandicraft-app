'use client';

import React from 'react';
import SidebarHeader from './SidebarHeader';
import SearchSection from './SearchSection';
import PriceFilter from './PriceFilter';
import CategoryFilter from './CategoryFilter';
import SpecialFeaturesFilter from './SpecialFeaturesFilter';
import ResetButton from './ResetButton';
import ActiveFiltersSummary from './ActiveFiltersSummary';

interface SpecialFeatures {
  isFeatured?: boolean;
  discountActive?: boolean;
  inStock?: boolean;
  isBestSeller?: boolean;
}

interface DesktopSidebarProps {
  searchInput: string;
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchInputBlur: () => void;
  onSearchInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onCompositionStart: () => void;
  onCompositionEnd: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (value: [number, number]) => void;
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  specialFeatures: SpecialFeatures;
  onSpecialFeatureToggle: (key: keyof SpecialFeatures) => void;
  expandedSections: {
    search: boolean;
    price: boolean;
    category: boolean;
    features: boolean;
  };
  onToggleSection: (
    section: 'search' | 'price' | 'category' | 'features'
  ) => void;
  onReset: () => void;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  searchInput,
  onSearchInputChange,
  onSearchInputBlur,
  onSearchInputKeyDown,
  onCompositionStart,
  onCompositionEnd,
  priceRange,
  onPriceRangeChange,
  categories,
  selectedCategory,
  onCategorySelect,
  specialFeatures,
  onSpecialFeatureToggle,
  expandedSections,
  onToggleSection,
  onReset,
}) => {
  return (
    <aside className="hidden md:block w-80 bg-gradient-to-b from-white to-amber-50/30 border-r border-amber-200/60 shadow-lg overflow-y-auto">
      <div className="p-6 space-y-6">
        <SidebarHeader onReset={onReset} />

        <SearchSection
          searchInput={searchInput}
          onSearchInputChange={onSearchInputChange}
          onSearchInputBlur={onSearchInputBlur}
          onSearchInputKeyDown={onSearchInputKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          isExpanded={expandedSections.search}
          onToggle={() => onToggleSection('search')}
        />

        <PriceFilter
          priceRange={priceRange}
          onPriceRangeChange={onPriceRangeChange}
          isExpanded={expandedSections.price}
          onToggle={() => onToggleSection('price')}
          isMobile={false}
        />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          isExpanded={expandedSections.category}
          onToggle={() => onToggleSection('category')}
        />

        <SpecialFeaturesFilter
          specialFeatures={specialFeatures}
          onSpecialFeatureToggle={onSpecialFeatureToggle}
          isExpanded={expandedSections.features}
          onToggle={() => onToggleSection('features')}
        />

        <ResetButton onReset={onReset} />

        <ActiveFiltersSummary
          searchInput={searchInput}
          selectedCategory={selectedCategory}
          priceRange={priceRange}
        />
      </div>
    </aside>
  );
};

export default DesktopSidebar;
