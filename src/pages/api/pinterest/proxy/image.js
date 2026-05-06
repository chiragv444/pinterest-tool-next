import { validatePinterestUrl, verifyPinterestSignature } from '../../../../lib/pinterestSecurity';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { imageUrl, pinterestUrl, token, timestamp, secretToken } = req.body ?? {};
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Invalid image URL' });
  }

  if (!validatePinterestUrl(pinterestUrl)) {
    return res.status(400).json({ success: false, error: 'Invalid Pinterest URL' });
  }

  const isValid = verifyPinterestSignature({ url: pinterestUrl, token, timestamp, secretToken });
  if (!isValid) {
    return res.status(403).json({ success: false, error: 'Unauthorized request' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'image/*,*/*;q=0.8',
        Referer: pinterestUrl,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: 'Failed to fetch image' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const urlPath = new URL(imageUrl).pathname;
    const filenameMatch = urlPath.match(/\/([^/]+\.(jpg|jpeg|png|gif|webp|bmp))$/i);
    const filename = filenameMatch ? filenameMatch[1] : 'pinterest-image.jpg';
    const buffer = Buffer.from(await response.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).send(buffer);
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : error instanceof Error
        ? error.message
        : 'Failed to proxy image';

    return res.status(500).json({ success: false, error: message });
  }
}
