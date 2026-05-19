export function getSiteUrl(req) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (envUrl) {
    return envUrl;
  }

  if (req?.headers) {
    const protocol = (req.headers['x-forwarded-proto'] || req.headers['x-forwarded-protocol'] || 'http').split(',')[0].trim();
    const host = req.headers.host || 'localhost:3000';
    return `${protocol}://${host}`.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/$/, '');
  }

  return 'http://localhost:3000';
}
