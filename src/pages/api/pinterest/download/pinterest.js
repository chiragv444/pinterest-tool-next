import { normalizePinterestResponse, validatePinterestUrl, verifyPinterestSignature } from '../../../../lib/pinterestSecurity';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY?.trim();
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST?.trim();
const RAPIDAPI_URL = process.env.RAPIDAPI_URL?.trim();

const assertRapidConfig = () => {
  if (!RAPIDAPI_KEY || !RAPIDAPI_HOST || !RAPIDAPI_URL) {
    throw new Error('Missing RapidAPI configuration. Check RAPIDAPI_KEY, RAPIDAPI_HOST, RAPIDAPI_URL');
  }
};

const buildRapidUrl = (url) => {
  const base = RAPIDAPI_URL.endsWith('/') ? `${RAPIDAPI_URL}pinterest` : `${RAPIDAPI_URL}/pinterest`;
  const target = new URL(base);
  target.searchParams.set('url', url);
  return target.toString();
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { url, token, timestamp, secretToken } = req.body ?? {};
  if (!validatePinterestUrl(url)) {
    return res.status(400).json({ success: false, error: 'Invalid Pinterest URL' });
  }

  const isValid = verifyPinterestSignature({ url, token, timestamp, secretToken });
  if (!isValid) {
    return res.status(403).json({ success: false, error: 'Unauthorized request' });
  }

  try {
    assertRapidConfig();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Server configuration error' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    const endpoint = buildRapidUrl(url);
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({ success: false, error: 'Failed to fetch Pinterest content' });
    }

    const payload = await response.json();
    if (!payload || payload.success === false) {
      return res.status(404).json({ success: false, error: payload?.message || 'Failed to fetch Pinterest content' });
    }

    const data = normalizePinterestResponse(payload);
    console.log("payload",payload);
    
    if (!data.url) {
      return res.status(404).json({ success: false, error: 'No downloadable media found for this URL' });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    const message =
      error instanceof Error && error.name === 'AbortError'
        ? 'Request timed out. Please try again.'
        : error instanceof Error
        ? error.message
        : 'Failed to download Pinterest content';

    return res.status(500).json({ success: false, error: message });
  }
}
