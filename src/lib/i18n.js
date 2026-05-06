const SUPPORTED_LANGS = [
  'en', 'id', 'vi', 'ms', 'es', 'fr', 'de', 'hu', 'it', 'pl', 'pt', 'ro', 'th', 'tr', 'ru', 'hi', 'zh', 'ja', 'ar'
];

export function getSupportedLanguages() {
  return SUPPORTED_LANGS;
}

export function isSupportedRoute(lang) {
  return SUPPORTED_LANGS.includes(lang);
}

export function getLanguageRoute(lang) {
  return lang === 'en' ? '' : `/${lang}`;
}

export function getLocale(lang, namespace) {
  const req = eval('require');
  const fs = req('fs');
  const path = req('path');
  const filePath = path.join(process.cwd(), 'locales', namespace, `${lang}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export const SUPPORTED_LANG_SEGMENT_PATTERN = SUPPORTED_LANGS.join('|');
