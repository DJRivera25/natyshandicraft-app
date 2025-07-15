'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchReviewsThunk } from '@/features/review/reviewThunk';
import { addToCartThunk } from '@/features/cart/cartThunk';
import {
  apiFetchProducts,
  apiCheckPurchaseVerification,
} from '@/utils/api/products';
import { useToast } from '@/components/Toast';
import { useProductInteractions } from '@/hooks/useProductInteractions';
import type { Product } from '@/types/product';

// Import subcomponents
import {
  ProductGallery,
  ProductHeader,
  ReviewSummary,
  ProductPricing,
  StockStatus,
  ProductDescription,
  ProductTags,
  ProductAvailability,
  AddToCartSection,
  AdminControls,
  ReviewsSection,
  SuggestedProducts,
  SoldQuantityInfo,
} from './ProductDetails/index';

interface ProductDetailsProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
  isTogglingActive?: boolean;
}

// Enhanced User type with proper typing
interface User {
  id: string;
  isAdmin?: boolean;
  fullName?: string;
  email?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
  onToggleActive,
  isTogglingActive,
}) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const { showToast } = useToast();

  // Use the new product interactions hook
  const {
    views,
    wishlistCount,
    isWishlisted,
    isLoading: wishlistLoading,
    toggleWishlist,
  } = useProductInteractions({
    productId: product._id,
    initialViews: product.views,
    initialWishlistCount: product.wishlistCount,
  });

  const user: User | null = useMemo(
    () =>
      session?.user
        ? {
            id: session.user.id,
            isAdmin: session.user.isAdmin,
            fullName: session.user.fullName ?? undefined,
            email: session.user.email ?? undefined,
          }
        : null,
    [session?.user]
  );

  const {
    reviews,
    averageRating,
    reviewCount,
    loading: reviewsLoading,
    error: reviewsError,
  } = useAppSelector((state) => state.review);

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Calculate pricing
  const originalPrice = product.price;
  const discountAmount =
    product.discountActive && product.discountPercent
      ? (originalPrice * product.discountPercent) / 100
      : 0;
  const finalPrice = originalPrice - discountAmount;

  // Check if user can review
  const userReview = user ? reviews.find((r) => r.user === user.id) : undefined;
  const canReview = user && hasPurchased && !userReview;

  // Fetch purchase verification
  useEffect(() => {
    const checkPurchaseVerification = async () => {
      if (user && product._id) {
        try {
          const { hasPurchased: purchased } =
            await apiCheckPurchaseVerification(product._id);
          setHasPurchased(purchased);
        } catch (error) {
          console.error('Failed to check purchase verification:', error);
        }
      }
    };

    checkPurchaseVerification();
  }, [user, product._id]);

  // Fetch reviews
  useEffect(() => {
    if (product._id) {
      dispatch(fetchReviewsThunk(product._id));
    }
  }, [dispatch, product._id]);

  // Fetch suggested products
  useEffect(() => {
    const fetchSuggested = async () => {
      setLoadingSuggested(true);
      try {
        const response = await apiFetchProducts(1, 12);
        const related = response.products.filter(
          (p: Product) =>
            p._id !== product._id && p.category === product.category
        );
        setSuggestedProducts(related.slice(0, 8)); // Limit to 8 products
      } catch (error) {
        console.error('Failed to fetch suggested products:', error);
      } finally {
        setLoadingSuggested(false);
      }
    };

    if (product.category) {
      fetchSuggested();
    }
  }, [product._id, product.category]);

  // Handlers
  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity >= 1 && newQuantity <= product.stock) {
        setQuantity(newQuantity);
      }
    },
    [product.stock]
  );

  const handleAddToCart = useCallback(async () => {
    try {
      await dispatch(
        addToCartThunk({
          productId: product._id,
          name: product.name,
          price: finalPrice,
          image: product.imageUrl || '/placeholder.jpg',
          quantity,
        })
      );
      showToast('success', 'Product added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      showToast('error', 'Failed to add product to cart. Please try again.');
    }
  }, [dispatch, product, finalPrice, quantity, showToast]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('success', 'Product link copied to clipboard!');
    }
  }, [product.name, showToast]);

  const handleCarouselNavigation = useCallback(
    (direction: 'prev' | 'next') => {
      const maxIndex = Math.max(0, suggestedProducts.length - 4);
      if (direction === 'prev') {
        setCarouselIndex(Math.max(0, carouselIndex - 1));
      } else {
        setCarouselIndex(Math.min(maxIndex, carouselIndex + 1));
      }
    },
    [carouselIndex, suggestedProducts.length]
  );

  // Create updated product object with real-time data
  const updatedProduct = {
    ...product,
    views,
    wishlistCount,
  };

  return (
    <div className="w-full">
      {/* Product Gallery Section */}
      <section className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
        {/* Gallery */}
        <div className="w-full lg:w-2/3 flex items-start">
          <ProductGallery
            product={updatedProduct}
            selectedImageIndex={selectedImageIndex}
            onImageSelect={setSelectedImageIndex}
          />
        </div>

        {/* Product Information */}
        <div className="w-full lg:w-1/3 flex flex-col min-w-0">
          <div className="space-y-3 sm:space-y-4">
            {/* Product Header */}
            <ProductHeader
              product={updatedProduct}
              isWishlisted={isWishlisted}
              onWishlistToggle={toggleWishlist}
              onShare={handleShare}
              isLoading={wishlistLoading}
            />

            {/* Review Summary */}
            <ReviewSummary
              averageRating={averageRating}
              reviewCount={reviewCount}
            />

            {/* Pricing */}
            <ProductPricing
              product={updatedProduct}
              finalPrice={finalPrice}
              originalPrice={originalPrice}
              discountAmount={discountAmount}
            />

            {/* Stock & Sales Info */}
            <div className="space-y-2 sm:space-y-3">
              <StockStatus product={updatedProduct} isAdmin={isAdmin} />
              <SoldQuantityInfo product={updatedProduct} />
            </div>

            {/* Description */}
            <ProductDescription product={updatedProduct} />

            {/* Tags */}
            <ProductTags product={updatedProduct} />

            {/* Availability */}
            <ProductAvailability product={updatedProduct} />
          </div>

          {/* Add to Cart Section */}
          {!isAdmin && (
            <AddToCartSection
              product={updatedProduct}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Admin Controls */}
          {isAdmin && (
            <AdminControls
              product={updatedProduct}
              onEdit={onEdit || (() => {})}
              onDelete={onDelete || (() => {})}
              onToggleActive={onToggleActive || (() => {})}
              isTogglingActive={isTogglingActive}
            />
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection
        productId={product._id}
        averageRating={averageRating}
        reviewCount={reviewCount}
        reviews={reviews}
        reviewsLoading={reviewsLoading}
        reviewsError={reviewsError}
        canReview={canReview || false}
      />

      {/* Suggested Products */}
      <SuggestedProducts
        suggestedProducts={suggestedProducts}
        loadingSuggested={loadingSuggested}
        carouselIndex={carouselIndex}
        onCarouselNavigation={handleCarouselNavigation}
      />
    </div>
  );
};

export default ProductDetails;
