/**
 * Utility to resolve and sanitize store logo URLs on the customer storefront.
 * Handles relative paths (/uploads/...), localhost fallback mapping,
 * insecure HTTP protocol upgrades, and Cloudinary URLs.
 */
export const resolveLogoUrl = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return '';
  const clean = url.trim();

  // Data URLs or blob URLs
  if (clean.startsWith('data:') || clean.startsWith('blob:')) {
    return clean;
  }

  // Cloudinary HTTPS or upgrade HTTP
  if (clean.startsWith('https://res.cloudinary.com')) {
    return clean;
  }
  if (clean.startsWith('http://res.cloudinary.com')) {
    return clean.replace(/^http:\/\//i, 'https://');
  }

  // Relative backend static uploads path
  if (clean.startsWith('/uploads/') || clean.startsWith('uploads/')) {
    const p = clean.startsWith('/') ? clean : `/${clean}`;
    return `https://rs-gifts-backend.onrender.com${p}`;
  }

  // Rewrite localhost / 127.0.0.1 to production Render backend
  if (clean.includes('localhost:5000') || clean.includes('127.0.0.1:5000')) {
    return clean.replace(/^https?:\/\/(localhost|127\.0\.0\.1):5000/, 'https://rs-gifts-backend.onrender.com');
  }

  // Upgrade standard HTTP to HTTPS (prevents Mixed Content block on GitHub Pages)
  if (clean.startsWith('http://') && !clean.includes('localhost')) {
    return clean.replace(/^http:\/\//i, 'https://');
  }

  return clean;
};

export default resolveLogoUrl;
