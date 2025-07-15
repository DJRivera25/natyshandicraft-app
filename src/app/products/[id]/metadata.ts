import { Metadata } from 'next';
import { Product, IProduct } from '@/models/Product';
import { connectDB } from '@/lib/db';

const defaultImage =
  'https://res.cloudinary.com/demo/image/upload/v12345/default-og-image.jpg'; // Replace with your real default image
const isAbsoluteUrl = (url: string | undefined): boolean =>
  !!url && /^https?:\/\//.test(url);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  await connectDB();
  const product = await Product.findById(params.id).lean<IProduct | null>();
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product does not exist.',
      robots: { index: false, follow: false },
    };
  }

  const url = `https://natyshandicraft-app.vercel.app/products/${params.id}`;
  const image = isAbsoluteUrl(product.imageUrl)
    ? product.imageUrl!
    : defaultImage;
  const title = product.name;
  const description =
    product.description || 'Discover unique, handcrafted Filipino products.';

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: `Naty's Handycrafts  `,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_PH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      site: '@natys_handicrafts',
      creator: '@natys_handicrafts',
    },
    other: {
      // JSON-LD structured data for product
      'script[type="application/ld+json"]': JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.name,
        image: [image],
        description: product.description,
        sku: product.sku || params.id,
        brand: {
          '@type': 'Brand',
          name: "Naty's Handycrafts",
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PHP',
          price: product.price,
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url,
        },
      }),
    },
  };
}
