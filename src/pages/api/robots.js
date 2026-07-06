import { getSiteUrl } from '../../lib/siteUrl';

export default function handler(req, res) {
  const siteUrl = getSiteUrl(req);

  const robots = `User-agent: *
Disallow: /api/
Disallow: /uploads/
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robots);
  res.end();
}
