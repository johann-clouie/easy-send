import type { Metadata } from "next";
import { siteConfig, siteUrl } from "./site";

const defaultOgImagePath = "/opengraph-image";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalized}`;
}

/** Shared Open Graph / Telegram / WhatsApp / Facebook preview fields. */
function socialImages(alt: string): NonNullable<Metadata["openGraph"]>["images"] {
  return [
    {
      url: absoluteUrl(`${defaultOgImagePath}`),
      width: 1200,
      height: 630,
      alt,
      type: "image/png",
    },
    {
      url: absoluteUrl("/logo.png"),
      width: 512,
      height: 512,
      alt: `${siteConfig.name} logo`,
      type: "image/png",
    },
  ];
}

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(siteConfig.name)
    ? title
    : `${title} | ${siteConfig.name}`;
  const allKeywords = [...siteConfig.keywords, ...keywords];
  const ogAlt = `${title} — ${siteConfig.name}`;

  return {
    title: fullTitle,
    description,
    keywords: allKeywords,
    authors: [{ name: siteConfig.name, url: siteUrl }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    applicationName: siteConfig.name,
    category: "finance",
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      images: socialImages(ogAlt),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [absoluteUrl(defaultOgImagePath)],
    },
    other: {
      // Telegram & WhatsApp read standard Open Graph tags; these reinforce previews.
      "og:image:secure_url": absoluteUrl(defaultOgImagePath),
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": "image/png",
      "og:image:alt": ogAlt,
      "format-detection": "telephone=no",
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: siteUrl }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "finance",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/logo.png", type: "image/png", sizes: "512x512" }],
    shortcut: ["/favicon.png"],
  },
  manifest: absoluteUrl("/manifest.webmanifest"),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: socialImages(`${siteConfig.name} — send cryptocurrency online`),
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [absoluteUrl(defaultOgImagePath)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  other: {
    "og:image:secure_url": absoluteUrl(defaultOgImagePath),
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
    "apple-mobile-web-app-title": siteConfig.name,
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": siteConfig.themeColor,
    "theme-color": siteConfig.themeColor,
  },
};
