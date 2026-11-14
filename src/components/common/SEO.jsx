import { useEffect } from 'react';

const BASE_URL = 'https://manuen-infotech-opc-private-limited.github.io/RS-Gifts';
const DEFAULT_IMAGE = `${BASE_URL}/images/about/about-hero-gifts.jpg`;

/**
 * Lightweight Zero-Dependency SEO Manager for RS-Gifts Storefront.
 * Dynamically synchronizes document head metadata, OpenGraph tags, canonical links,
 * and Schema.org JSON-LD structured data without any visual UI rendering.
 */
export const SEO = ({
  title,
  description = 'RS Gifts - Thoughtful, personalized, and luxury gifting in India. Explore curated hampers, customized keepsakes, anniversary & birthday surprises with express delivery.',
  keywords,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  schema = null,
}) => {
  useEffect(() => {
    // 1. Update Title
    const finalTitle = title ? (title.includes('RS Gifts') ? title : `${title} | RS Gifts`) : 'RS Gifts | Thoughtful, Personalized & Luxury Gifting';
    document.title = finalTitle;

    // Helper to set or create a meta tag
    const setMeta = (attribute, name, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMeta('name', 'description', description);
    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    // 3. Canonical Link
    const fullCanonical = canonical
      ? (canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical.startsWith('/') ? '' : '/'}${canonical}`)
      : window.location.href.split('?')[0];

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonical);

    // 4. OpenGraph Tags
    setMeta('property', 'og:title', finalTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', fullCanonical);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'RS Gifts');
    const fullImage = image && image.startsWith('http') ? image : `${BASE_URL}${image.startsWith('/') ? '' : '/'}${image}`;
    setMeta('property', 'og:image', fullImage);

    // 5. Twitter Card Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', finalTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', fullImage);

    // 6. Schema.org JSON-LD Structured Data
    const SCRIPT_ID = 'route-json-ld';
    let scriptTag = document.getElementById(SCRIPT_ID);

    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    return () => {
      // Optional cleanup on unmount if route changes
      const currentScript = document.getElementById(SCRIPT_ID);
      if (currentScript) currentScript.remove();
    };
  }, [title, description, keywords, canonical, image, type, schema]);

  return null;
};

export default SEO;

