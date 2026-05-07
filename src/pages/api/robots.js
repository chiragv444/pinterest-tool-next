export default function handler(req, res) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

  const robots = `User-agent: *
Disallow: /api/
Disallow: /uploads/
Allow: /

Sitemap: ${siteUrl}/api/sitemap
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robots);
  res.end();
}
