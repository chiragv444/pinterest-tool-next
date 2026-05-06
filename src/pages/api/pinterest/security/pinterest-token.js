import { validatePinterestUrl, generatePinterestSignature } from '../../../../lib/pinterestSecurity';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { url } = req.body ?? {};
  if (!validatePinterestUrl(url)) {
    return res.status(400).json({ success: false, error: 'Invalid Pinterest URL' });
  }

  const signature = generatePinterestSignature(url);
  return res.status(200).json({ success: true, expiresIn: 300, ...signature });
}
