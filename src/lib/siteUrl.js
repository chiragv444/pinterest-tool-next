// For static pages, use NEXT_PUBLIC_SITE_URL or window location
export function getSiteUrlStatic() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envUrl) {
    return envUrl;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}

// For API routes and server-side rendering
export function getSiteUrl(req) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envUrl) {
    return envUrl;
  }

  if (req?.headers) {
    const forwardedProtoHeader = req.headers['x-forwarded-proto'] || req.headers['x-forwarded-protocol'];
    const forwardedHeader = req.headers.forwarded;
    const protocolFromForwarded = forwardedHeader?.split(';').find((part) => part.trim().startsWith('proto='))?.split('=')[1];
    const protocol = (forwardedProtoHeader || protocolFromForwarded || 'http').split(',')[0].trim();

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
    return `${protocol}://${host}`.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}
