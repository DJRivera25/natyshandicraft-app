import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET!;

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute =
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/order');

  const isLoginPage = pathname.startsWith('/login');
  const isCompleteProfilePage = pathname.startsWith('/complete-profile');
  const isThankYouPage = pathname.startsWith('/complete-profile/thank-you');

  // ✅ Get the session token (works for both encrypted or JWT strategy)
  const token = await getToken({ req: request, secret });
  console.log(`token`, token);

  // 🛑 Not logged in and trying to access protected pages
  if (!token && (isProtectedRoute || isCompleteProfilePage)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // ✅ If logged in, check additional conditions
  if (token) {
    const missingFields =
      !token.address || !token.birthDate || !token.mobileNumber;

    // 🛡️ Admin-only route
    if (pathname.startsWith('/admin') && !token.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // 🧩 Incomplete profile -> must go to /complete-profile
    if (missingFields && !isCompleteProfilePage && !isThankYouPage) {
      return NextResponse.redirect(new URL('/complete-profile', request.url));
    }

    // ✅ Profile already complete but trying to go to /complete-profile
    if (!missingFields && isCompleteProfilePage && !isThankYouPage) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    // 🔁 Prevent authenticated users from seeing login page
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|unauthorized).*)',
  ],
};
