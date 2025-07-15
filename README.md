# Naty's Handicraft App

A modern, full-featured e-commerce platform for handcrafted Filipino products.

---

## 🚀 Features

### 1. Product Catalog

- Browse all products with pagination and filtering
- Product cards with image, price, stock, and quick actions
- Product details page with main image and up to 3 perspective images (Cloudinary URLs)
- Description, tags, category, promo text
- Pricing, discounts, and stock status
- Reviews and average rating
- Add to cart and wishlist actions

**Key Code:**

- `src/components/ProductCard.tsx`, `ProductDetails.tsx`, `ProductDetails/ProductGallery.tsx`
- `src/app/products/[id]/page.tsx`, `src/app/products/page.tsx`
- `src/components/addProductModal.tsx`, `EditProductModal.tsx` (image upload logic)
- `src/app/api/products/` (API routes)
- **Techniques:** Next.js dynamic routing, Cloudinary image upload, Redux state for product data

---

### 2. Search & Filtering

- Search by name, category, price, tags, special features
- Sidebar filters, active filters summary, reset button

**Key Code:**

- `src/components/ProductsFilterSidebar/`, `ProductsFilterSidebar.tsx`, `ActiveFiltersSummary.tsx`
- `src/app/products/page.tsx` (search and filter state)
- `src/app/api/products/search/route.ts` (search API)
- **Techniques:** Debounced search, Redux state, semantic filtering

---

### 3. Cart & Checkout

- Add to cart from product list/details
- Cart page with item list, quantity selector, remove option
- Cart summary, checkout, order placement, order success/history

**Key Code:**

- `src/components/Cart/`, `CartItem.tsx`, `CartSummary.tsx`, `AddToCartClient.tsx`
- `src/app/cart/page.tsx`, `src/app/order/page.tsx`, `src/app/order/success/page.tsx`
- `src/features/cart/cartSlice.ts`, `cartThunk.ts`
- **Techniques:** Redux cart state, optimistic UI, order API integration

---

### 4. User Authentication & Profile

- Login with Google/Facebook (NextAuth)
- User profile page, complete profile flow, validation
- Profile order history

**Key Code:**

- `src/app/login/page.tsx`, `src/app/profile/page.tsx`, `src/app/complete-profile/page.tsx`
- `src/features/auth/authSlice.ts`, `authThunk.ts`
- `src/lib/authOptions.ts` (NextAuth config)
- **Techniques:** NextAuth, session management, protected routes

---

### 5. Reviews & Ratings

- Leave reviews/ratings for purchased products
- Review list and summary on product details
- Admin moderation

**Key Code:**

- `src/components/ProductDetails/ReviewForm.tsx`, `ReviewList.tsx`, `ReviewsSection.tsx`, `ReviewSummary.tsx`
- `src/app/api/products/[id]/reviews/route.ts`
- `src/features/review/reviewSlice.ts`, `reviewThunk.ts`
- **Techniques:** Conditional review form, review aggregation, API validation

---

### 6. Wishlist

- Add/remove products to/from wishlist
- Wishlist count per product, status indicator

**Key Code:**

- `src/components/ProductCard.tsx`, `ProductDetails/AdminControls.tsx`
- `src/app/api/products/[id]/wishlist/route.ts`
- **Techniques:** User-product relationship, optimistic UI

---

### 7. Admin Dashboard

- Analytics (sales, user growth, top products)
- Product management (add, edit, delete, toggle status)
- Order/user management
- Notification system

**Key Code:**

- `src/app/admin/dashboard/`, `src/app/admin/products/`, `src/app/admin/orders/`, `src/app/admin/users/`
- `src/components/AdminTable.tsx`, `AdminModal.tsx`, `AdminSidebar.tsx`, `AdminHeader.tsx`
- `src/app/api/products/`, `orders/`, `users/` (admin API routes)
- **Techniques:** Role-based access, analytics charts, modal management

---

### 8. Notifications

- Real-time notifications for admins
- Notification dropdown, bell icon, mark as read

**Key Code:**

- `src/components/NotificationBell.tsx`, `NotificationDropdown.tsx`, `NotificationProvider.tsx`
- `src/app/api/admin/notifications/`
- `src/lib/pusherClient.ts`, `pusherServer.ts` (real-time)
- **Techniques:** Pusher real-time events, notification state

---

### 9. Chat & Support

- Real-time chat between users and support/admin
- Chat dropdown, floating chat window, typing indicators

**Key Code:**

- `src/components/ChatProvider.tsx`, `ChatDropdown.tsx`, `FloatingChatWindow.tsx`
- `src/app/api/chat/`, `chat-support/`
- **Techniques:** Pusher, chat room state, message read/typing

---

### 10. Performance & Caching

- Redis caching for product lists, details, search, categories
- Cache invalidation on product create/update/delete
- Optimized image loading (Next.js Image)

**Key Code:**

- `src/lib/redis.ts`, `src/app/api/products/` (caching logic)
- `src/components/ProductCard.tsx`, `ProductDetails/ProductGallery.tsx` (Next.js Image)
- **Techniques:** Upstash Redis, cache keys, TTL, invalidation

---

### 11. SEO & Metadata

- Dynamic metadata for product pages (OpenGraph, Twitter cards)
- SEO-friendly URLs, canonical links

**Key Code:**

- `src/app/products/[id]/metadata.ts`, `src/app/layout.tsx`
- **Techniques:** Next.js metadata API, OpenGraph, Twitter meta

---

### 12. Responsive & Modern UI

- Fully responsive design for all devices
- Modern UI with animations, modals, overlays
- Accessible components, clear guidance

**Key Code:**

- `src/components/`, `src/app/globals.css`
- **Techniques:** Tailwind CSS, framer-motion, accessibility best practices

---

### 13. Newsletter & Marketing

- Newsletter overlay for engagement
- Promo text, featured products

**Key Code:**

- `src/components/NewsletterOverlay.tsx`, `FeaturedProducts.tsx`, `BestSellingProducts.tsx`, `NewArrivals.tsx`

---

### 14. Payment Integration

- Xendit payment gateway for checkout
- Webhook handling for payment status

**Key Code:**

- `src/app/api/xendit/route.ts`, `src/app/api/webhooks/xendit/route.ts`
- **Techniques:** Payment API, webhook security

---

### 15. Miscellaneous

- Google Maps for address selection: `src/components/GoogleMapSelector.tsx`
- Progress tracker: `src/components/ProgressTracker.tsx`
- Toast notifications: `src/components/Toast.tsx`

---

## 🛠️ Tech Stack

- Next.js, React, Redux Toolkit
- MongoDB, Mongoose
- Upstash Redis, Cloudinary, Xendit, Pusher
- NextAuth (Google, Facebook)
- Tailwind CSS, framer-motion

---

## 📁 Project Structure

- See `/src/app/`, `/src/components/`, `/src/features/`, `/src/models/`, `/src/types/` for more details.

---

## 📚 Contributing & Documentation

- See code comments and this README for feature and file mapping.
- For detailed API docs, see `/src/app/api/` and related files.
