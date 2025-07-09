import React from 'react';
import Image from 'next/image';

const paymentMethods = [
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png',
    alt: 'Visa',
    width: 40,
    height: 24,
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png',
    alt: 'Mastercard',
    width: 40,
    height: 24,
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
    alt: 'PayPal',
    width: 40,
    height: 24,
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    alt: 'Apple Pay',
    width: 24,
    height: 24,
  },
  {
    src: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
    alt: 'Google Pay',
    width: 24,
    height: 24,
  },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-amber-100 to-white pt-32 pb-8 w-full">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between gap-16 border-b border-amber-200 pb-12">
          {/* Company Info */}
          <div className="flex-1 min-w-[220px]">
            <div className="font-extrabold text-2xl mb-2 text-amber-900">
              SHOP.CO
            </div>
            <p className="text-amber-700 text-base mb-4">
              We have clothes that suit your style and which you’re proud to
              wear. From women to men.
            </p>
            <div className="flex gap-3">
              {/* Social icons (same as before) */}
              <a
                href="#"
                aria-label="Twitter"
                className="text-amber-400 hover:text-amber-900"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.12 2.94 3.99 2.97A8.6 8.6 0 0 1 2 19.54c-.32 0-.63-.02-.94-.06A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-amber-400 hover:text-amber-900"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.65-4.79 1.32 0 2.45.1 2.78.14v3.22h-1.91c-1.5 0-1.79.71-1.79 1.75v2.3h3.58l-.47 3.62h-3.11V24h6.09c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-amber-400 hover:text-amber-900"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.16c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.35 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.7-.86-.92-1.45-.17-.46-.35-1.26-.41-2.43C2.172 15.584 2.16 15.2 2.16 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.35 2.43-.41C8.416 2.172 8.8 2.16 12 2.16zm0-2.16C8.736 0 8.332.012 7.052.07c-1.28.058-2.16.24-2.91.51-.8.29-1.48.68-2.15 1.35-.67.67-1.06 1.35-1.35 2.15-.27.75-.45 1.63-.51 2.91C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.24 2.16.51 2.91.29.8.68 1.48 1.35 2.15.67.67 1.35 1.06 2.15 1.35.75.27 1.63.45 2.91.51C8.332 23.988 8.736 24 12 24c3.264 0 3.668-.012 4.948-.07 1.28-.058 2.16-.24 2.91-.51.8-.29 1.48-.68 2.15-1.35.67-.67 1.06-1.35 1.35-2.15.27-.75.45-1.63.51-2.91.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.24-2.16-.51-2.91-.29-.8-.68-1.48-1.35-2.15-.67-.67-1.35-1.06-2.15-1.35-.75-.27-1.63-.45-2.91-.51C15.668.012 15.264 0 12 0z" />
                  <circle cx="12" cy="12" r="3.6" />
                  <circle cx="18.406" cy="5.594" r="1.44" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link Columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <div className="font-semibold mb-2 tracking-wider text-amber-900">
                COMPANY
              </div>
              <ul className="space-y-2 text-amber-700 text-base">
                <li>
                  <a href="#" className="hover:text-amber-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Career
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2 tracking-wider text-amber-900">
                HELP
              </div>
              <ul className="space-y-2 text-amber-700 text-base">
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Customer Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Delivery Details
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2 tracking-wider text-amber-900">
                FAQ
              </div>
              <ul className="space-y-2 text-amber-700 text-base">
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Account
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Manage Deliveries
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Payments
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2 tracking-wider text-amber-900">
                RESOURCES
              </div>
              <ul className="space-y-2 text-amber-700 text-base">
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Free eBooks
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Development Tutorial
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    How to - Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-900">
                    Youtube Playlist
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 text-xs text-amber-700 gap-4">
          <div>Shop.co © 2000-2023, All Rights Reserved</div>
          <div className="bg-white rounded-xl shadow-md px-4 py-2 flex gap-3 items-center border border-amber-200">
            {paymentMethods.map((pm) => (
              <span
                key={pm.alt}
                className="inline-flex items-center justify-center"
              >
                <Image
                  src={pm.src}
                  alt={pm.alt}
                  width={pm.width}
                  height={pm.height}
                  className="object-contain"
                />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
