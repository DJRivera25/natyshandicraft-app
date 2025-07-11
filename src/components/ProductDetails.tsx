'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchReviewsThunk,
  postReviewThunk,
  deleteReviewThunk,
} from '@/features/review/reviewThunk';
import { addToCartThunk } from '@/features/cart/cartThunk';
import { apiFetchProducts } from '@/utils/api/products';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  Heart,
  Share2,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Package,
  Tag,
  Calendar,
  ShoppingCart,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  ThumbsUp,
  User,
  Clock,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import type { Product } from '@/types/product';

interface ProductDetailsProps {
  product: Product;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleActive?: () => void;
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
}) => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const user: User | null = session?.user
    ? {
        id: session.user.id,
        isAdmin: session.user.isAdmin,
        fullName: session.user.fullName ?? undefined,
        email: session.user.email ?? undefined,
      }
    : null;

  const {
    reviews,
    averageRating,
    reviewCount,
    loading: reviewsLoading,
    error: reviewsError,
  } = useAppSelector((state) => state.review);

  // Local state
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loadingSuggested, setLoadingSuggested] = useState(false);

  // Refactor: Gallery and perspectives
  const perspectives = product.perspectives?.slice(0, 3) || [];
  const galleryImages = [product.imageUrl, ...perspectives].filter(
    Boolean
  ) as string[];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const currentImage = galleryImages[selectedImageIndex] || '/placeholder.jpg';

  // Calculate pricing
  const originalPrice = product.price;
  const discountAmount =
    product.discountActive && product.discountPercent
      ? (originalPrice * product.discountPercent) / 100
      : 0;
  const finalPrice = originalPrice - discountAmount;

  // Check if user can review (placeholder - would need purchase verification)
  const hasPurchased = false; // TODO: Implement purchase verification
  const userReview = user ? reviews.find((r) => r.user === user.id) : undefined;
  const canReview = user && hasPurchased && !userReview;

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
      // TODO: Show success toast
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // TODO: Show error toast
    }
  }, [dispatch, product, finalPrice, quantity]);

  const handleReviewSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!rating || !comment.trim() || !product._id) return;

      setSubmitting(true);
      try {
        await dispatch(postReviewThunk(product._id, rating, comment));
        setRating(0);
        setComment('');
        // TODO: Show success toast
      } catch (error) {
        console.error('Failed to submit review:', error);
        // TODO: Show error toast
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, product._id, rating, comment]
  );

  const handleReviewDelete = useCallback(
    async (userId: string) => {
      if (!product._id) return;

      try {
        await dispatch(deleteReviewThunk(product._id, userId));
        // TODO: Show success toast
      } catch (error) {
        console.error('Failed to delete review:', error);
        // TODO: Show error toast
      }
    },
    [dispatch, product._id]
  );

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

  // Carousel visibility
  const visibleProducts = suggestedProducts.slice(
    carouselIndex,
    carouselIndex + 4
  );
  const canPrev = carouselIndex > 0;
  const canNext = carouselIndex + 4 < suggestedProducts.length;

  return (
    <div className="w-full">
      {/* Product Gallery Section */}
      <section className="w-full flex flex-col lg:flex-row gap-8 p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Vertical Thumbnails + Main Image */}
        <div className="flex flex-row gap-4 lg:gap-8 min-w-0 w-full lg:w-1/2">
          {/* Vertical Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex flex-col gap-3 items-center justify-center">
              {galleryImages.slice(0, 3).map((img, idx) => (
                <button
                  key={img + idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === selectedImageIndex
                      ? 'border-amber-500 shadow-lg'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={product.name + ' thumbnail'}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
          {/* Main Image */}
          <div className="flex-1 flex items-center justify-center min-w-[320px] min-h-[320px]">
            <img
              src={currentImage}
              alt={product.name}
              className="object-contain w-full h-[400px] max-w-[500px] rounded-xl bg-gradient-to-br from-amber-50 to-white"
              style={{ background: '#f7f7f7' }}
            />
          </div>
        </div>
        {/* Product Information (flex-col, justify-between for bottom alignment) */}
        <div className="flex-1 flex flex-col min-w-0 justify-between">
          <div className="space-y-4">
            {/* Product Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl lg:text-4xl font-bold text-amber-900 mb-2 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Tag className="w-4 h-4" />
                      {product.category || 'Uncategorized'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      SKU: {product.sku || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {product.views} views
                    </span>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      alert(
                        isWishlisted
                          ? 'Removed from wishlist'
                          : 'Added to wishlist'
                      );
                    }}
                    className={`p-3 rounded-full transition-all ${
                      isWishlisted
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
                    />
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: product.name,
                          text: `Check out this product: ${product.name}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Product link copied!');
                      }
                    }}
                    className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {/* Review summary above price */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-700">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-amber-600 text-lg">/ 5</span>
                <div className="flex gap-0.5 ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <div className="text-gray-600">
                <span className="font-medium">{reviewCount}</span> review
                {reviewCount === 1 ? '' : 's'}
              </div>
            </div>
            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-amber-700">
                  ₱{finalPrice.toLocaleString()}
                </span>
                {discountAmount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₱{originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">
                      Save ₱{discountAmount.toLocaleString()}
                    </span>
                  </>
                )}
              </div>
              {product.promoText && (
                <div className="px-3 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">
                    {product.promoText}
                  </p>
                </div>
              )}
            </div>
            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  product.stock > 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {product.stock > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {product.stock > 10
                        ? 'In Stock'
                        : `Only ${product.stock} left`}
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </>
                )}
              </div>
              {product.stock <= product.restockThreshold &&
                product.stock > 0 && (
                  <div className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
                    <span className="text-sm font-medium">Low Stock Alert</span>
                  </div>
                )}
            </div>
            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
              <div className="text-gray-700 leading-relaxed">
                {showFullDescription ? (
                  <div className="whitespace-pre-line">
                    {product.description}
                  </div>
                ) : (
                  <div className="whitespace-pre-line">
                    {product.description && product.description.length > 200
                      ? `${product.description.slice(0, 200)}...`
                      : product.description}
                  </div>
                )}
                {product.description && product.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm mt-2"
                  >
                    {showFullDescription ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            </div>
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Availability Dates */}
            {(product.availableFrom || product.availableUntil) && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Availability
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {product.availableFrom && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      From:{' '}
                      {new Date(product.availableFrom).toLocaleDateString()}
                    </span>
                  )}
                  {product.availableUntil && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Until:{' '}
                      {new Date(product.availableUntil).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Add to Cart at bottom */}
          {!isAdmin && (
            <div className="mt-auto space-y-4 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add to Cart
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 text-lg font-semibold min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={async () => {
                    try {
                      await handleAddToCart();
                      alert('Added to cart!');
                    } catch {
                      alert('Failed to add to cart.');
                    }
                  }}
                  disabled={product.stock === 0}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
              {product.stock > 0 && (
                <div className="text-sm text-gray-600 text-center">
                  Free shipping on orders over ₱1,000
                </div>
              )}
            </div>
          )}
          {/* Admin Controls */}
          {isAdmin && (
            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Admin Controls
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={onEdit}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit Product
                </button>

                <button
                  onClick={onToggleActive}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors font-medium ${
                    product.isActive
                      ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {product.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                  {product.isActive ? 'Deactivate' : 'Activate'}
                </button>

                <button
                  onClick={onDelete}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {product.createdAt
                      ? new Date(product.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-gray-600">Sold:</span>
                  <span className="font-medium">
                    {product.soldQuantity} units
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="w-full bg-white border-t border-amber-100 p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* Reviews Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-amber-600" />
                Customer Reviews
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-bold text-amber-700">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="text-amber-600 text-lg">/ 5</span>
                  </div>
                  <div className="flex gap-0.5 ml-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-gray-600">
                  <span className="font-medium">{reviewCount}</span> review
                  {reviewCount === 1 ? '' : 's'}
                </div>
              </div>
            </div>

            {/* Review Form */}
            {canReview && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleReviewSubmit}
                className="space-y-4 p-6 bg-gradient-to-br from-amber-50 to-white rounded-2xl border border-amber-200"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  Write a Review
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating *
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl transition-colors ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 hover:text-yellow-300'
                          }`}
                        >
                          <Star className="w-6 h-6" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                      rows={4}
                      maxLength={500}
                      required
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {comment.length}/500 characters
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || !rating || !comment.trim()}
                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-semibold shadow-lg hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4" />
                        Submit Review
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                <span className="ml-3 text-gray-600">Loading reviews...</span>
              </div>
            ) : reviewsError ? (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">{reviewsError}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No reviews yet
                </h3>
                <p className="text-gray-600">
                  Be the first to review this product!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <motion.div
                    key={`${review.user}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              User {review.user.slice(-4)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      star <= review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>

                      {(user?.id === review.user || user?.isAdmin) && (
                        <button
                          onClick={() => handleReviewDelete(review.user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Suggested Products Carousel */}
      {suggestedProducts.length > 0 && (
        <section className="w-full bg-gradient-to-br from-amber-50 to-white border-t border-amber-100 p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                You Might Also Like
              </h2>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCarouselNavigation('prev')}
                  disabled={!canPrev}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleCarouselNavigation('next')}
                  disabled={!canNext}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loadingSuggested ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
                <span className="ml-3 text-gray-600">
                  Loading suggestions...
                </span>
              </div>
            ) : (
              <div className="relative">
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                  layout
                >
                  <AnimatePresence mode="popLayout">
                    {visibleProducts.map((suggestedProduct, index) => (
                      <motion.div
                        key={suggestedProduct._id}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.1,
                          type: 'spring',
                          stiffness: 200,
                          damping: 20,
                        }}
                        className="group cursor-pointer"
                        onClick={() => {
                          // TODO: Navigate to product page
                          window.location.href = `/products/${suggestedProduct._id}`;
                        }}
                      >
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                          <div className="aspect-square bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
                            <img
                              src={
                                suggestedProduct.imageUrl || '/placeholder.jpg'
                              }
                              alt={suggestedProduct.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />

                            {/* Status badges */}
                            <div className="absolute top-2 left-2 flex flex-col gap-1">
                              {suggestedProduct.isFeatured && (
                                <div className="px-2 py-1 bg-yellow-400 text-white text-xs font-bold rounded-full">
                                  Featured
                                </div>
                              )}
                              {suggestedProduct.discountActive &&
                                suggestedProduct.discountPercent && (
                                  <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                    -{suggestedProduct.discountPercent}%
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                              {suggestedProduct.name}
                            </h3>

                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-amber-700">
                                ₱{suggestedProduct.price.toLocaleString()}
                              </span>

                              <div className="flex items-center gap-1 text-sm text-gray-600">
                                <Package className="w-4 h-4" />
                                <span>{suggestedProduct.stock}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;
