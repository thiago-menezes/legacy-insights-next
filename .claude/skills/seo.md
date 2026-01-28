---
name: seo
description: Use this skill when implementing SEO optimizations, meta tags, structured data, or improving search visibility. Triggers on requests about SEO, meta tags, Open Graph, structured data, or search optimization.
---

# SEO Skill

Implement SEO best practices for Legacy Insight using Next.js App Router.

## Metadata API

### Static Metadata

```tsx
// app/(features)/dashboard/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Legacy Insight',
  description:
    'Monitor your marketing campaigns, track ROI, and analyze performance across all platforms.',
  keywords: ['analytics', 'marketing dashboard', 'ROI tracking'],
  openGraph: {
    title: 'Dashboard | Legacy Insight',
    description: 'Unified analytics for digital marketers',
    type: 'website',
    images: ['/og-dashboard.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dashboard | Legacy Insight',
    description: 'Unified analytics for digital marketers',
    images: ['/og-dashboard.png'],
  },
};

export default function DashboardPage() {
  return <Dashboard />;
}
```

### Dynamic Metadata

```tsx
// app/(features)/workspaces/[slug]/page.tsx
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const workspace = await getWorkspace(slug);

  return {
    title: `${workspace.name} | Legacy Insight`,
    description: `Analytics and insights for ${workspace.name}`,
    openGraph: {
      title: `${workspace.name} | Legacy Insight`,
      description: `Analytics and insights for ${workspace.name}`,
    },
  };
}

export default async function WorkspacePage({ params }: PageProps) {
  const { slug } = await params;
  return <Workspace slug={slug} />;
}
```

## Root Layout Metadata

```tsx
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://legacyinsight.com'),
  title: {
    default: 'Legacy Insight | Marketing Analytics Platform',
    template: '%s | Legacy Insight',
  },
  description:
    'Centralized analytics platform for digital marketers. Track campaigns, ROI, and conversions from Google Ads, Meta Ads, and sales platforms.',
  keywords: [
    'marketing analytics',
    'campaign tracking',
    'ROI',
    'digital marketing',
  ],
  authors: [{ name: 'Legacy Insight' }],
  creator: 'Legacy Insight',
  publisher: 'Legacy Insight',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Legacy Insight',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Legacy Insight - Marketing Analytics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@legacyinsight',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
};
```

## Structured Data (JSON-LD)

```tsx
// components/structured-data/organization.tsx
export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Legacy Insight',
    url: 'https://legacyinsight.com',
    logo: 'https://legacyinsight.com/logo.png',
    sameAs: [
      'https://twitter.com/legacyinsight',
      'https://linkedin.com/company/legacyinsight',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// components/structured-data/software-application.tsx
export const SoftwareApplicationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Legacy Insight',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
```

## Sitemap

```tsx
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://legacyinsight.com';

  // Static pages
  const staticPages = ['', '/features', '/pricing', '/about', '/contact'].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: route === '' ? 1 : 0.8,
    }),
  );

  // Dynamic pages (if public)
  // const workspaces = await getPublicWorkspaces();
  // const workspacePages = workspaces.map((ws) => ({
  //   url: `${baseUrl}/workspaces/${ws.slug}`,
  //   lastModified: new Date(ws.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // }));

  return [...staticPages];
}
```

## Robots.txt

```tsx
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard/'],
      },
    ],
    sitemap: 'https://legacyinsight.com/sitemap.xml',
  };
}
```

## Canonical URLs

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://legacyinsight.com/features',
    languages: {
      'pt-BR': 'https://legacyinsight.com/pt/features',
      'en-US': 'https://legacyinsight.com/en/features',
    },
  },
};
```

## Performance Optimizations

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/hero.png"
  alt="Legacy Insight Dashboard"
  width={1200}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>;
```

### Font Optimization

```tsx
// app/layout.tsx
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
```

## SEO Checklist

### Technical SEO

- [ ] Proper heading hierarchy (h1 > h2 > h3)
- [ ] Meta titles under 60 characters
- [ ] Meta descriptions 120-160 characters
- [ ] Canonical URLs set
- [ ] Sitemap generated
- [ ] Robots.txt configured
- [ ] 301 redirects for old URLs

### Content SEO

- [ ] Unique title for each page
- [ ] Unique description for each page
- [ ] Keyword in title and description
- [ ] Alt text on images
- [ ] Internal linking

### Performance

- [ ] Core Web Vitals optimized
- [ ] Images optimized (WebP, proper sizing)
- [ ] Fonts preloaded
- [ ] Critical CSS inlined

### Social

- [ ] Open Graph tags set
- [ ] Twitter Card tags set
- [ ] OG images at 1200x630px
