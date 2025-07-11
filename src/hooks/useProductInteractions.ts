import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import {
  apiIncrementProductViews,
  apiToggleWishlist,
  apiCheckWishlistStatus,
} from '@/utils/api/products';
import { useToast } from '@/components/Toast';

interface UseProductInteractionsProps {
  productId: string;
  initialViews?: number;
  initialWishlistCount?: number;
}

export const useProductInteractions = ({
  productId,
  initialViews = 0,
  initialWishlistCount = 0,
}: UseProductInteractionsProps) => {
  const { data: session } = useSession();
  const { showToast } = useToast();

  const [views, setViews] = useState(initialViews);
  const [wishlistCount, setWishlistCount] = useState(initialWishlistCount);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasIncrementedViews, setHasIncrementedViews] = useState(false);

  // Check wishlist status on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (session?.user?.id) {
        try {
          const { isWishlisted: status } =
            await apiCheckWishlistStatus(productId);
          setIsWishlisted(status);
        } catch (error) {
          console.error('Failed to check wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [productId, session?.user?.id]);

  // Increment views when component mounts (only once per session)
  useEffect(() => {
    const incrementViews = async () => {
      if (!hasIncrementedViews) {
        try {
          const { views: updatedViews } =
            await apiIncrementProductViews(productId);
          setViews(updatedViews);
          setHasIncrementedViews(true);
        } catch (error) {
          console.error('Failed to increment product views:', error);
        }
      }
    };

    incrementViews();
  }, [productId, hasIncrementedViews]);

  // Toggle wishlist
  const toggleWishlist = useCallback(async () => {
    if (!session?.user?.id) {
      showToast('error', 'Please log in to manage your wishlist');
      return;
    }

    setIsLoading(true);
    try {
      const action = isWishlisted ? 'remove' : 'add';
      const { isWishlisted: newStatus, wishlistCount: newCount } =
        await apiToggleWishlist(productId, action);

      setIsWishlisted(newStatus);
      setWishlistCount(newCount);

      showToast(
        'success',
        newStatus ? 'Added to wishlist' : 'Removed from wishlist'
      );
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      showToast('error', 'Failed to update wishlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [productId, isWishlisted, session?.user?.id, showToast]);

  return {
    views,
    wishlistCount,
    isWishlisted,
    isLoading,
    toggleWishlist,
  };
};
