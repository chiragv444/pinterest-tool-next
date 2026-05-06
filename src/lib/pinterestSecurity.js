import crypto from 'crypto';

export const PINTEREST_URL_PATTERN = /^https?:\/\/(www\.)?(pinterest\.(com|co\.uk|ca|de|fr|es|it|nl|ru|jp|au|nz|ie|at|ch|se|no|dk|fi|pl|pt|br|mx|in|kr|tr|cz|hu|ro|gr|co|cl|ar|pe|ph|id|my|sg|th|vn|ae|il|za|co\.za|co\.ke|co\.ug|co\.tz|co\.zw|co\.bw|co\.gh|co\.mu|co\.mw|co\.na|co\.sz|co\.zm)|pin\.it)\/.+/i;
const TOKEN_TTL_MS = 5 * 60 * 1000;

const getSecret = () => {
  const secret = process.env.AUTH_SECRET?.trim();
  return secret && secret.length > 0 ? secret : 'default';
};

const createHash = (secret, payload) =>
  crypto.createHmac('sha256', secret).update(payload).digest('hex');

export const validatePinterestUrl = (url) => {
  return typeof url === 'string' && PINTEREST_URL_PATTERN.test(url.trim());
};

export const generatePinterestSignature = (url) => {
  const secret = getSecret();
  const timestamp = Date.now().toString();

  return {
    token: createHash(secret, timestamp),
    timestamp,
    secretToken: createHash(secret, `${url}${timestamp}`),
  };
};

export const verifyPinterestSignature = ({ url, token, timestamp, secretToken, ttlMs = TOKEN_TTL_MS }) => {
  if (!validatePinterestUrl(url) || !token || !timestamp || !secretToken) {
    return false;
  }

  const requestTime = Number.parseInt(timestamp, 10);
  if (Number.isNaN(requestTime)) {
    return false;
  }

  if (Math.abs(Date.now() - requestTime) > ttlMs) {
    return false;
  }

  const secret = getSecret();
  const expectedToken = createHash(secret, timestamp);
  const expectedSecretToken = createHash(secret, `${url}${timestamp}`);

  return expectedToken === token && expectedSecretToken === secretToken;
};

const guessExtension = (url, fallbackType) => {
  const match = url.match(/\.(\w+)(?:\?|$)/i);
  if (match?.[1]) {
    return match[1].toLowerCase();
  }

  return fallbackType === 'video' ? 'mp4' : 'jpg';
};

const mapMediaType = (media, fallbackType) => {
  const rawType = media?.type || media?.contentType || media?.mimeType;
  if (!rawType) {
    return fallbackType;
  }

  if (/video|mp4|mov|webm/i.test(rawType)) {
    return 'video';
  }

  if (/image|jpg|jpeg|png|gif|webp/i.test(rawType)) {
    return 'image';
  }

  return fallbackType;
};

export const normalizePinterestResponse = (raw) => {
  const base = raw ?? {};
  const data = base?.data ?? base?.result ?? base;

  const medias = Array.isArray(data?.medias)
    ? data.medias
    : Array.isArray(data?.media)
    ? data.media
    : Array.isArray(data?.items)
    ? data.items
    : Array.isArray(base?.medias)
    ? base.medias
    : [];

  const resources = medias
    .map((media, idx) => {
      const url = media?.url || media?.downloadUrl;
      if (!url) return undefined;

      const type = media?.isVideo ? 'video' : mapMediaType(media, idx === 0 ? 'video' : 'image');
      console.log("type", type);
      console.log("media", media);
      
      
      const label =
        media?.label ||
        media?.quality ||
        media?.qualityLabel ||
        `${type === 'video' ? 'Video' : 'Image'} ${media?.size ?? ''}`.trim();

      return {
        url,
        label,
        quality: media?.quality || media?.qualityLabel || undefined,
        size: media?.size || media?.filesize || media?.fileSize || undefined,
        type,
        extension: media?.extension || media?.ext || guessExtension(url, type),
      };
    })
    .filter(Boolean);

  const primaryResource = resources[0];
  const declaredType = data?.type;
  const fallbackUrl =
    primaryResource?.url ||
    data?.downloadUrl ||
    data?.url ||
    base?.url ||
    base?.downloadUrl ||
    '';

  const finalType = (declaredType || primaryResource?.type || base?.type || 'video');
  const resolvedUrl = primaryResource?.url || fallbackUrl || '';
    console.log("finaltype", finalType, declaredType, primaryResource?.type);

    
  const normalizedData = {
    title: data?.title || base?.title || 'Pinterest Content',
    type: finalType,
    thumbnail: data?.thumbnail || data?.thumb || base?.thumbnail || base?.thumb || base?.cover,
    resources: resources.length > 0 ? resources : [],
    downloadUrl: resolvedUrl,
    url: resolvedUrl,
  };

  if (!normalizedData.resources.length && resolvedUrl) {
    normalizedData.resources.push({
      url: resolvedUrl,
      label: normalizedData.title,
      type: finalType,
      extension: guessExtension(resolvedUrl, finalType),
    });
  }

  return normalizedData;
};
