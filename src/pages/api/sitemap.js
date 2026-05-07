import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

  try {
    // Read the static sitemap from public folder
    const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');
    let sitemap = readFileSync(sitemapPath, 'utf-8');

    // Replace all hardcoded domains with the dynamic one
    sitemap = sitemap.replace(/http:\/\/pinvideodown\.com/g, siteUrl);

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.write(sitemap);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to load sitemap' });
  }
}
