'use client';

import React from 'react';
import SidebarHeader from './SidebarHeader';
import SearchSection from './SearchSection';
import PriceFilter from './PriceFilter';
import CategoryFilter from './CategoryFilter';
import SpecialFeaturesFilter, {
  SpecialFeatures,
} from './SpecialFeaturesFilter';
import ResetButton from './ResetButton';
import ActiveFiltersSummary from './ActiveFiltersSummary';

type MobileSidebarProps = {
  isSidebarOpen: boolean;
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
  specialFeatures: import('./SpecialFeaturesFilter').SpecialFeatures;
  onSpecialFeatureToggle: (
    key: keyof import('./SpecialFeaturesFilter').SpecialFeatures
  ) => void;
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
};

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isSidebarOpen,
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
    <aside
      className={`fixed md:hidden my-10 z-50 top-0 left-0 h-screen w-72 sm:w-80 max-w-[90vw] bg-gradient-to-b from-white to-amber-50/30 border-r border-amber-200/60 shadow-2xl overflow-y-auto ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
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
          isMobile={true}
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

export default MobileSidebar;
