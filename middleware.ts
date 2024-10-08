import { NextResponse } from 'next/server';

export function middleware() {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${ nonce }' 'strict-dynamic' ${ process.env.NODE_ENV === 'development' ? '\'unsafe-eval\'' : ''
};
    style-src 'self' 'nonce-${ nonce }';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
`;

  const responseHeaders = new Headers();

  // Response headers
  responseHeaders.set(
    'Content-Security-Policy',
    // Replace newline characters and spaces
    cspHeader.replace(/\s{2,}/g, ' ').trim(),
  );

  return NextResponse.next({
    headers: responseHeaders,
  });
}

export const config = {
  matcher: [

    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
