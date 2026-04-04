---
name: nextjs-seo
description: Optimize for search engine visibility and ranking using Next.js 16 best practices. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".
license: MIT
metadata:
  author: web-quality-skills
  version: "2.0"
  framework: "Next.js 16"
---

## This repository: find-my-property

Align generic SEO guidance with **this** codebase (re-check `package.json` if versions drift).

| Topic | In this project |
|--------|------------------|
| Stack | Next.js **16.2.x**, React **19**, App Router, **`app/`** at repo root (**no** `src/`). |
| Config | **`next.config.mjs`** — use it for `headers()`, `images.remotePatterns`, etc. Examples below that show `next.config.ts` apply the same API in **`next.config.mjs`**. |
| Root metadata | **`app/layout.tsx`** currently exports **no** `metadata` / `generateMetadata` — add site defaults here or in route `layout.tsx` / `page.tsx`. |
| Technical SEO files | **`app/robots.ts`** and **`app/sitemap.ts`** are **not** added yet. Add them under `app/` when implementing. Do **not** confuse with **`views/Sitemap.tsx`** / **`app/sitemap/page.tsx`** (that is a **user-facing** sitemap page, not the XML sitemap route). |
| Routes | Public browse: **`(browse)`**; dashboards: **`admin/`**, **`agent/`**, **`tenant/`**; auth: **`login`**, **`register`**, **`onboarding`**, **`verify-agent`**. Use `disallow` in `robots` for private/API paths as appropriate. |
| Images | `next.config.mjs` already allows **Cloudinary** and a dev host — follow existing **`next/image`** patterns. |

# SEO optimization with Next.js 16

Search engine optimization based on Next.js 16 features, Lighthouse SEO audits, and Google Search guidelines. Focus on technical SEO, on-page optimization, and structured data using modern Next.js capabilities.

# SEO fundamentals

Search ranking factors (approximate influence):
Factor | Influence | Next.js 16 Support
Content quality & relevance | ~40% | ✓ Via metadata and content structure
Backlinks & authority | ~25% | ✗
Technical SEO | ~15% | ✓ Built-in support
Page experience (Core Web Vitals) | ~10% | ✓ Image optimization, code splitting
On-page SEO | ~10% | ✓ Metadata API

Technical SEO

Crawlability

**robots.txt:**

Create `app/robots.ts` or `app/robots.js`:

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/private/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

**Meta robots:**

Define through the Metadata API in your layout or page.

**XML sitemap**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://example.com/products',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://example.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
  ]
}
```

**For large sitemaps with multiple files:**

```ts
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }]
}

export default async function sitemap({ id }: { id: Promise<string> }) {
  const resolvedId = await id // Next.js 16 requires awaiting the id
  const start = Number(resolvedId) * 50000
  // Generate URLs for this batch
}
```

**Sitemap best practices:**
Maximum 50,000 URLs or 50MB per sitemap
Use generateSitemaps for larger sites
Include only canonical, indexable URLs
Update lastModified when content changes
Submit to Google Search Console

URL structure

✅ Good URLs:
https://example.com/products/blue-widget
https://example.com/blog/how-to-use-widgets

❌ Poor URLs:
https://example.com/p?id=12345
https://example.com/products/item/category/subcategory/blue-widget-2024-sale

**URL guidelines:**
Use hyphens, not underscores
Lowercase only
Keep short and descriptive
Use Next.js dynamic routes for consistency

**Security headers for SEO trust signals:**

Add to `next.config.ts`:

```ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ]
  },
}
```

On-page SEO

Title tags and Meta descriptions

Use the Metadata API in your layout or page:

```ts
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blue Widgets for Sale | Premium Quality | Example Store',
  description: 'Shop premium quality blue widgets. Fast shipping, 2-year warranty included.',
  openGraph: {
    title: 'Blue Widgets for Sale | Premium Quality',
    description: 'Shop premium quality blue widgets.',
    url: 'https://example.com',
    images: [
      {
        url: 'https://example.com/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function Page() {
  return '...'
}
```

**Title tag guidelines:**
50-60 characters (Google truncates around 60)
Primary keyword near the beginning
Unique for every page
Brand name at end (unless homepage)

**Meta description guidelines:**
150-160 characters
Include primary keyword naturally
Compelling call-to-action
Unique for every page

Heading structure

Use semantic HTML with logical hierarchy:

```tsx
export default function ProductPage() {
  return (
    <main>
      <h1>Blue Widgets - Premium Quality</h1>
      <section>
        <h2>Product Features</h2>
        <h3>Durability</h3>
        <h3>Design</h3>
      </section>
      <section>
        <h2>Customer Reviews</h2>
      </section>
      <section>
        <h2>Pricing</h2>
      </section>
    </main>
  )
}
```

**Heading guidelines:**
Single h1 per page
Logical hierarchy (don't skip levels)
Include keywords naturally
Descriptive, not generic

Image SEO

Use the Next.js `next/image` component:

```tsx
import Image from 'next/image'

export default function ProductImage() {
  return (
    <Image
      src="/blue-widget.jpg"
      alt="Premium blue widget with advanced features"
      width={800}
      height={600}
      priority={false}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}
```

**Image guidelines:**
Descriptive filenames with keywords
Alt text describes the image content
Use `next/image` for automatic optimization
WebP/AVIF with fallbacks (automatic with next/image)
Lazy load below-fold images (default behavior)
Set proper width and height for Core Web Vitals

Internal linking

Use the Next.js Link component:

```tsx
import Link from 'next/link'

export default function Navigation() {
  return (
    <nav>
      <Link href="/products/blue-widgets">
        Browse our blue widget collection
      </Link>
      <Link href="/guides/widget-maintenance">
        Learn how to maintain your widgets
      </Link>
    </nav>
  )
}
```

**Linking guidelines:**
Descriptive anchor text with keywords
Link to relevant internal pages
Reasonable number of links per page
Fix broken links promptly
Use breadcrumbs for hierarchy

Structured data (JSON-LD)

Add JSON-LD directly in your page component:

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Product Page',
}

export default function ProductPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Blue Widget Pro',
    image: 'https://example.com/blue-widget.jpg',
    description: 'Premium blue widget with advanced features.',
    brand: {
      '@type': 'Brand',
      name: 'WidgetCo',
    },
    offers: {
      '@type': 'Offer',
      price: '49.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: 'https://example.com/products/blue-widget',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '1250',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* Page content */}
    </>
  )
}
```

**Common schema types:**

Organization, Article, Product, FAQ, BreadcrumbList

**Validation:**

Test structured data at:
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

Mobile SEO

Responsive design

Next.js automatically handles responsive viewport configuration:

```tsx
export const metadata: Metadata = {
  viewport: 'width=device-width, initial-scale=1',
}
```

Tap targets

```css
/* ✅ Adequate tap target for mobile */
.mobile-friendly-link {
  padding: 12px;
  font-size: 16px;
  min-height: 48px;
  min-width: 48px;
}
```

Font sizes

```css
/* ✅ Readable without zooming */
body {
  font-size: 16px;
  line-height: 1.5;
}
```

International SEO

Hreflang tags

Add to your Metadata API:

```ts
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://example.com/en/product',
    languages: {
      'es-ES': 'https://example.com/es/product',
      'fr-FR': 'https://example.com/fr/product',
    },
  },
}
```

SEO audit checklist

Critical
[ ] HTTPS enabled
[ ] robots.ts configured
[ ] No noindex on important pages
[ ] Title tags present and unique (via Metadata API)
[ ] Single h1 per page
[ ] Metadata API implemented

High priority
[ ] Meta descriptions present
[ ] Sitemap.ts generated and submitted
[ ] Canonical URLs set
[ ] Mobile-responsive
[ ] Core Web Vitals passing
[ ] next/image used for images

Medium priority
[ ] Structured data (JSON-LD) implemented
[ ] Internal linking strategy
[ ] Image alt text
[ ] Descriptive URLs with dynamic routes
[ ] Breadcrumb navigation
[ ] Open Graph images configured

Ongoing
[ ] Fix crawl errors in Search Console
[ ] Update sitemap.ts when content changes
[ ] Monitor ranking changes
[ ] Check for broken links
[ ] Review Search Console insights
[ ] Monitor Core Web Vitals with Vercel Analytics

Next.js 16 SEO features

Image optimization

```tsx
import Image from 'next/image'

// Automatic format conversion, lazy loading, responsive sizes
export default function OptimizedImage() {
  return (
    <Image
      src="/image.png"
      alt="Descriptive alt text"
      width={800}
      height={600}
      priority={true} // For above-fold images
    />
  )
}
```

Dynamic metadata with `generateMetadata`

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id)
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      images: [{ url: product.image }],
    },
  }
}
```

Code splitting with dynamic imports

```tsx
// Only load script when needed
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <p>Loading...</p>,
})
```

Tools

Tool | Use
Google Search Console | Monitor indexing, fix issues
Google PageSpeed Insights | Performance + Core Web Vitals
Rich Results Test | Validate structured data
Lighthouse | Full SEO audit
Vercel Analytics | Track performance metrics
Next.js Metadata API | Configure SEO tags programmatically

References

[Next.js SEO Playbook](https://vercel.com/blog/nextjs-seo-playbook)
[Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
[Google Search Central](https://developers.google.com/search)
[Schema.org](https://schema.org)
[Core Web Vitals](https://web.dev/vitals/)

---