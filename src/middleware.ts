import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()

  // ── Production: *.earket.com ──────────────────────────────────────────
  // Strip port for local dev
  const host = hostname.split(':')[0]

  // Only handle subdomains — skip www, app, dashboard, api
  const RESERVED = ['www', 'app', 'api', 'dashboard', 'earket', 'localhost']

  // Check if it's a subdomain of earket.com
  const isEarketSubdomain = host.endsWith('.earket.com')
  if (!isEarketSubdomain) return NextResponse.next()

  const subdomain = host.replace('.earket.com', '')

  // Skip reserved subdomains
  if (RESERVED.includes(subdomain)) return NextResponse.next()

  // Skip if already on a store path (prevent loops)
  if (url.pathname.startsWith('/store/') || url.pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Rewrite subdomain request to the store route
  // jbmart.earket.com → earket.com/store/jbmart (by subdomain lookup)
  // We pass the subdomain as a query param — the store page resolves it
  url.pathname = `/store-subdomain/${subdomain}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static
     * - _next/image
     * - favicon
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
